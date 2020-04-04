const _ = require('lodash');
const moment = require('moment');

exports.getLast6Months = startDate => {
  if (!moment.isMoment(startDate)) {
    startDate = moment(startDate);
  }
  // const momentCopy = _.cloneDeep(startDate);
  //include the month of start date
  const last6Months = [startDate];
  for (let i = 1; i < 6; i++) {
    // last6Months.push(_.cloneDeep(momentStartDate).subtract(i, 'months'));
    last6Months.push(_.cloneDeep(startDate).subtract(i, 'month'));
  }
  return last6Months;
};
