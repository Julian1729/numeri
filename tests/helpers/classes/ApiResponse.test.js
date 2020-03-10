const chai = require('chai');
const sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.should();
chai.use(sinonChai);
const { mockResponse } = require('mock-req-res');

const { ApiResponse } = require('../../../helpers/classes');

describe('ApiResponse', () => {

  it('should call send', () => {

    let res = mockResponse({});
    sinon.spy(res.json);
    let apiResponse = new ApiResponse(res);
    apiResponse.send();
    res.json.should.have.been.calledWith(apiResponse.payload);

  });

  it('should set default data object response', () => {

    let res = mockResponse({});
    let apiResponse = new ApiResponse(res);
    apiResponse.dataBase({
      units_added: 0,
      another_amount: 0,
      name: 'Unknown Name'
    });
    apiResponse.payload.should.have.property('data');
    apiResponse.payload.data.should.have.property('units_added');
    apiResponse.payload.data.units_added.should.equal(0);

  });

  describe('data', () => {

    it('should set data object value', () => {

      let res = mockResponse({});
      let apiResponse = new ApiResponse(res);
      apiResponse.dataBase({
        units_added: 0,
        another_amount: 0,
        name: 'Unknown Name'
      });
      apiResponse.payload.data.units_added.should.equal(0);
      apiResponse.data('units_added', 12);
      apiResponse.payload.data.units_added.should.equal(12);

    });

    it('should set nested data object value', () => {

      let res = mockResponse({});
      let apiResponse = new ApiResponse(res);
      apiResponse.dataBase({
        units_added: 0,
        another_amount: 0,
        name: {
          first: null,
          last: null
        }
      });
      apiResponse.data('name.first', 'Michael');
      apiResponse.data('name.last', 'Scott');
      apiResponse.payload.data.name.first.should.equal('Michael');
      apiResponse.payload.data.name.last.should.equal('Scott');

    });


    it('should get data object property on root', () => {

      let res = mockResponse({});
      let apiResponse = new ApiResponse(res);
      apiResponse.dataBase({
        units_added: 0,
        another_amount: 0,
        name: 'Unknown Name'
      });
      apiResponse.data('units_added', 12);
      apiResponse.data('units_added').should.equal(12);

    });

    it('should get nested data object property', () => {

      let res = mockResponse({});
      let apiResponse = new ApiResponse(res);
      apiResponse.dataBase({
        units_added: 0,
        another_amount: 0,
        name: {
          first: 'Michael',
          last: 'Scott'
        }
      });
      apiResponse.data('name.first').should.equal('Michael');

    });

    it('should return undefined for undefined path', () => {

      let res = mockResponse({});
      let apiResponse = new ApiResponse(res);
      apiResponse.dataBase({
        units_added: 0,
        another_amount: 0,
        name: 'Unknown Name'
      });
      chai.expect(apiResponse.data('units_added.undefinedPath')).to.equal(undefined);

    });

  });

  // describe('validErrors', () => {
  //
  //   it('should set valid errors', () => {
  //
  //     let res = mockResponse({});
  //     sinon.spy(res.json);
  //     let apiResponse = new ApiResponse(res);
  //     let errors = ['INVALID_CREDENTIALS', 'FORM_VALIDATION_ERROR'];
  //     apiResponse.validErrors = errors;
  //     chai.expect(apiResponse.validErrors).to.exist.and.to.have.lengthOf(2);
  //     chai.expect(apiResponse.validErrors).to.include('INVALID_CREDENTIALS');
  //     chai.expect(apiResponse.validErrors).to.include('FORM_VALIDATION_ERROR');
  //
  //   });
  //
  //   it('should set throw error for using invalid errors', () => {
  //
  //     let res = mockResponse({});
  //     sinon.spy(res.json);
  //     let apiResponse = new ApiResponse(res);
  //     let errors = ['INVALID_CREDENTIALS', 'FORM_VALIDATION_ERROR'];
  //     apiResponse.validErrors = errors;
  //     try {
  //       apiResponse.error('INVALID_FIELDS', 'The error message');
  //       throw 'INVALID_FIELDS should not have passes as valid error';
  //     } catch (e) {
  //       e.should.exist;
  //     }
  //
  //   });
  //
  // });

  describe('error', () => {

    // it('should set error w/ additional props', () => {
    //
    //   let res = mockResponse({});
    //   sinon.spy(res.json);
    //   let apiResponse = new ApiResponse(res);
    //   apiResponse.validErrors = ['INVALID_CREDENTIALS', 'FORM_VALIDATION_ERROR'];
    //   apiResponse.error('INVALID_CREDENTIALS', 'This is the error message', {fields: ['one', 'two'], another: {this: 'one'}});
    //   apiResponse.send();
    //   res.json.should.have.been.calledWith({
    //     data:{},
    //     error: {
    //       type: 'INVALID_CREDENTIALS',
    //       message: 'This is the error message',
    //       fields: ['one', 'two'],
    //       another: {this: 'one'}
    //     }
    //   });
    //
    // });

    it('should allow method chaining', () => {

      let res = mockResponse({});
      sinon.spy(res.json);
      let apiResponse = new ApiResponse(res);
      apiResponse
        .error('INVALID_CREDENTIALS', 'This is the error message')
        .send();
      res.json.should.have.been.calledOnceWith({data: {}, success: false, error: {type: 'INVALID_CREDENTIALS', message: 'This is the error message'}});

    });

  });



});
