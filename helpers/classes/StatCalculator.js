const _ = require('lodash');
const mongoose = require('mongoose');

const { visitModel, publisherModel } = require('../../models');

class StatCalculator {
  publishers = [];
  averages = {
    hours: {
      months: {},
      congregation: 0,
      elders: 0,
      ms: 0,
      pioneers: {
        regular: 0,
        special: 0,
        aux: 0,
      },
      unbaptized: 0,
    },
    meetingAttendance: {
      overall: 0,
      months: {},
    },
  };
  lists = {
    inactive: [],
    irregular: [],
    pioneers: {
      regular: [],
      special: [],
      aux: [],
    },
    anointed: [],
    elders: [],
    ms: [],
    unbaptized: [],
  };
  totals = {
    hours: {
      months: {},
      congregation: 0,
      pioneers: {
        regular: 0,
        special: 0,
        aux: 0,
      },
      elders: 0,
      ms: 0,
      unbaptized: 0,
    },
    meetingAttendance: {
      overall: 0,
      months: {},
    },
  };
  visit = null;

  constructor(visit) {
    if (
      visit instanceof mongoose.Model !== true &&
      process.env.NODE_ENV !== 'test'
    ) {
      throw new TypeError(
        'Expecting argument to be a Visit mongoose model instance.'
      );
    }
    this.visit = visit;
  }

  collect = async () => {
    // console.log('visit', this.visit.id);
    const publishers = await publisherModel.find({
      visitId: this.visit.id || this.visit._id,
    });
    // console.log('foundp', publishers);
    if (_.isEmpty(publishers)) {
      console.error(
        `No publishers found with visitId ${this.visit.id || this.visit._id}`
      );
    }
    this.publishers = publishers;
  };

  calculate() {
    // loop through publishers
    this._loopPublishers(this.publishers);
    this._calculateHourAverages();
    this._calculateMeetingAttendance();
  }

  _calculateMeetingAttendance = () => {
    // console.log(this.visit.meetingAttendance);
    let totalMeetings = 0;
    _.forIn(this.visit.meetingAttendance, ({ month, year, weeks }) => {
      const meetings = _.flatten(weeks);
      totalMeetings = meetings.length; // add to total of meetings
      const monthTotal = meetings.reduce(
        (total, attendance) => total + attendance
      );
      this.totals.meetingAttendance.overall += monthTotal; // add to month total
      const monthPropertyKey = `${month}-${year}`;
      // add to month totals
      this.totals.meetingAttendance.months[monthPropertyKey] = monthTotal;
      // calculate month average
      this.averages.meetingAttendance.months[monthPropertyKey] =
        Math.ceil(monthTotal / totalMeetings) || 0;
    });
    // calculate overall visit meeting attendance average
    this.averages.meetingAttendance.overall =
      Math.ceil(this.totals.meetingAttendance.overall / totalMeetings) || 0;
  };

  _calculateHourAverages = () => {
    // monthly
    const monthTotals = this.totals.hours.months;
    _.forIn(monthTotals, (total, month) => {
      this.averages.hours.months[month] = Math.ceil(
        total / this.publishers.length
      );
    });
    // congregation average
    this.averages.hours.congregation =
      Math.ceil(this.totals.hours.congregation / this.publishers.length) || 0;
    // elder average
    this.averages.hours.elders =
      Math.ceil(this.totals.hours.elders / this.lists.elders.length) || 0;
    // ms average
    this.averages.hours.ms =
      Math.ceil(this.totals.hours.ms / this.lists.ms.length) || 0;
    // regular pioneer average
    this.averages.hours.pioneers.regular =
      Math.ceil(
        this.totals.hours.pioneers.regular / this.lists.pioneers.regular.length
      ) || 0;
    // aux pioneer average
    this.averages.hours.pioneers.aux =
      Math.ceil(
        this.totals.hours.pioneers.aux / this.lists.pioneers.aux.length
      ) || 0;
    // special pioneer average
    this.averages.hours.pioneers.special =
      Math.ceil(
        this.totals.hours.pioneers.special / this.lists.pioneers.special.length
      ) || 0;
    // unbaptized average
    this.averages.hours.unbaptized =
      Math.ceil(this.totals.hours.unbaptized / this.lists.unbaptized.length) ||
      0;
  };

  /**
   * Determine whether a publisher is considered
   * inactive based on their irregular months
   * @param  {Object}  monthsIrregular Object with irregular months
   * @return {Boolean}                 Whether or not inactive
   */
  _isInactive = monthsIrregular => {
    // console.log('months', JSON.stringify(monthsIrregular));
    // console.log('length', monthsIrregular.length);
    // need at least 6 to be inactive
    if (monthsIrregular.length < 6) {
      return false;
    }
    // sort
    monthsIrregular = _.sortBy(monthsIrregular);
    for (let i = monthsIrregular.length - 1; i >= 0; i--) {
      // console.log('=================================');
      // console.log('i', i);
      let month = monthsIrregular[i];
      let prevousMonth = month - 1;
      let previousActualMonth = monthsIrregular[i - 1];
      // console.log('month', month);
      // console.log('prevousMonth', prevousMonth);
      // console.log('previousActualMonth', previousActualMonth);
      if (
        prevousMonth !== previousActualMonth &&
        previousActualMonth !== undefined
      ) {
        // console.log('NOT INACTIVE');
        return false;
      }
      // console.log('NEXT');
      // console.log('=================================\n\n');
    }
    return true;
  };

  /**
   * Populate totals for hours
   * @param  {[type]} reports [description]
   * @return {[type]}         [description]
   */
  _loopReports = ({
    serviceReports,
    appointment,
    pioneerStatus,
    baptized,
    publisherId,
  }) => {
    let irregular = [];
    serviceReports.forEach(({ month, year, minutes }) => {
      if (!minutes) {
        if (_.find(irregular, 12)) {
          // user overlap month
          const overlapMap = {
            0: 13,
            1: 14,
            2: 15,
            3: 16,
            4: 17,
            5: 18,
            6: 19,
            7: 20,
            8: 21,
            9: 22,
            10: 23,
            11: 24,
          };
          return irregular.push(overlapMap[month]);
        } else {
          return irregular.push(month);
        }
      }

      // add to monthly totals
      if (!this.totals.hours.months[`${month}-${year}`]) {
        this.totals.hours.months[`${month}-${year}`] = 0;
      }
      this.totals.hours.months[`${month}-${year}`] += minutes;

      // add to congregation totals
      this.totals.hours.congregation += minutes;

      // add to totals for group
      switch (appointment) {
        case 'elder':
          this.totals.hours.elders += minutes;
          break;
        case 'ms':
          this.totals.hours.ms += minutes;
      }
      switch (pioneerStatus) {
        case 'regular':
          this.totals.hours.pioneers.regular += minutes;
          break;
        case 'aux':
          this.totals.hours.pioneers.aux += minutes;
          break;
        case 'special':
          this.totals.hours.pioneers.special += minutes;
      }
      if (!baptized) {
        this.totals.hours.unbaptized += minutes;
      }
    });

    if (!_.isEmpty(irregular)) {
      // determine whether publisher is inactive
      if (this._isInactive(irregular)) {
        this.lists.inactive.push(publisherId);
      } else {
        // add to irregular list
        this.lists.irregular.push(publisherId);
      }
    }
  };

  _pubExtract = publisher => {
    this._loopReports(publisher);
    this._group(publisher);
  };

  _loopPublishers = (publishers = []) => {
    publishers.forEach(this._pubExtract);
  };

  /**
   * Add publisher in its appropriate list
   * OPTIMIZE: add more group types like "gender"
   */
  _group({ baptized, appointment, pioneerStatus, anointed, publisherId }) {
    if (!baptized) {
      this.lists.unbaptized.push(publisherId);
    }
    if (anointed) {
      this.lists.anointed.push(publisherId);
    }
    // pioneer status
    switch (pioneerStatus) {
      case 'regular':
        this.lists.pioneers.regular.push(publisherId);
        break;
      case 'aux':
        this.lists.pioneers.aux.push(publisherId);
        break;
      case 'special':
        this.lists.pioneers.special.push(publisherId);
    }
    // appointment
    switch (appointment) {
      case 'elder':
        this.lists.elders.push(publisherId);
        break;
      case 'ms':
        this.lists.ms.push(publisherId);
    }
    // inactive (determine this when looping through reports)
  }
}

module.exports = StatCalculator;
