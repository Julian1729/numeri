const casual = require('casual');
const { ObjectId } = require('mongodb');
const moment = require('moment');
const _ = require('lodash');

const momentHelpers = require('../../helpers/moment.helpers');
const congregations = require('../3_congregations/congregations');

// only seed the first 2 hardcoded congregations with visits
const generateAttendanceWeeks = () => {
  const weeks = [];
  // insert 4 weeks
  for (let i = 0; i < 4; i++) {
    weeks.push([casual.integer(90, 120), casual.integer(90, 150)]);
  }
  return weeks;
};

const generateMeetingAttendance = last6Months => {
  const meetingAttendanceArray = [];
  last6Months.forEach(month => {
    meetingAttendanceArray.push({
      month: month.month(),
      year: month.year(),
      weeks: generateAttendanceWeeks(),
    });
  });
  return meetingAttendanceArray;
};

// OPTIMIZE: deprecate this function, and just grab last visit date and count back ? huh?
// const getLast6Months = startDate => {
//   startDate = _.cloneDeep(startDate);
//   let last6Months = [startDate]; //include the month of start date
//   // get last 6 months for valid simulation
//   for (let i = 1; i < 6; i++) {
//     // last6Months.push(_.cloneDeep(startDate).subtract(i, 'months'));
//     last6Months.push(_.cloneDeep(startDate).subtract(i, 'month'));
//   }
//   return last6Months;
// };

const generateCongregationVisit = (congregationId, startDate) => {
  const last6Months = momentHelpers.getLast6Months(startDate);
  const endDate = moment(startDate).isoWeekday('Sunday');
  const visit = {
    congregationId,
    startDate: startDate.toDate(),
    endDate: endDate.toDate(),
    importMethod: 1,
    meetingAttendance: generateMeetingAttendance(last6Months),
  };
  return visit;
};

// start sequence with Tuesday of current week
let visitsStartDate = moment().isoWeekday('Tuesday');

const generateCongregationVisitsSequence = congregationId => {
  const visits = [];
  visits.push(
    generateCongregationVisit(congregationId, _.cloneDeep(visitsStartDate))
  );
  // add 6 months to start date
  const nextVisitDate = _.cloneDeep(visitsStartDate).add(6, 'months');
  visits.push(generateCongregationVisit(congregationId, nextVisitDate));
  // push global start date forward 1 week
  visitsStartDate.add(1, 'weeks').isoWeekday('Tuesday');
  return visits;
};

const visits = generateCongregationVisitsSequence(congregations[0].id).concat(
  generateCongregationVisitsSequence(congregations[1].id)
);

// console.log(JSON.stringify(visits, null, 2));

module.exports = visits;
