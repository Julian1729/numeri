const { ObjectId } = require('mongodb');
const moment = require('moment');

module.exports = [
  {
    congregationId: new ObjectId(),
    startDate: moment('04-21-20', 'MM-DD-YY').toDate(),
    endDate: moment('04-26-20', 'MM-DD-YY').toDate(),
    importMethod: 1,
    meetingAttendance: [
      {
        month: 3,
        year: 2020,
        weeks: [[123, 145], [110, 123], [98, 156], [129, 143]],
      },
      {
        month: 2,
        year: 2020,
        weeks: [[123, 145], [110, 123], [98, 156], [129, 143]],
      },
      {
        month: 1,
        year: 2020,
        weeks: [[123, 145], [110, 123], [98, 156], [129, 143]],
      },
    ],
  },
  {
    congregationId: new ObjectId(),
    startDate: moment('04-28-20', 'MM-DD-YY').toDate(),
    endDate: moment('05-03-20', 'MM-DD-YY').toDate(),
    importMethod: 1,
    meetingAttendance: [
      {
        month: 3,
        year: 2020,
        weeks: [[123, 145], [102, 132], [130, 143], [116, 167]],
      },
      {
        month: 2,
        year: 2020,
        weeks: [[123, 145], [102, 132], [130, 143], [116, 167]],
      },
      {
        month: 1,
        year: 2020,
        weeks: [[123, 145], [102, 132], [130, 143], [116, 167]],
      },
    ],
  },
  {
    congregationId: new ObjectId(),
    startDate: moment('05-05-20', 'MM-DD-YY').toDate(),
    endDate: moment('05-10-20', 'MM-DD-YY').toDate(),
    importMethod: 1,
    meetingAttendance: [
      {
        month: 4,
        year: 2020,
        weeks: [[234, 200], [101, 123], [105, 156], [131, 143]],
      },
      {
        month: 3,
        year: 2020,
        weeks: [[234, 200], [101, 123], [105, 156], [131, 143]],
      },
      {
        month: 2,
        year: 2020,
        weeks: [[234, 200], [101, 123], [105, 156], [131, 143]],
      },
    ],
  },
];
