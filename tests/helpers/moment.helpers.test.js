const { expect } = require('chai');
const moment = require('moment');

const momentHelpers = require('../../helpers/moment.helpers');

describe('Moment Helpers', () => {
  it('should grab last 6 months', () => {
    const march31 = moment('03-31-2020', 'MM-DD-YYYY');
    const last6Months = momentHelpers.getLast6Months(march31);
    expect(last6Months).to.have.lengthOf(6);
    const monthMap = last6Months.map(momentDate => momentDate.month());
    expect(monthMap).to.eql([2, 1, 0, 11, 10, 9]);
  });
});
