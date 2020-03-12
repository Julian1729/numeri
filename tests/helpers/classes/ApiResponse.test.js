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


  describe('data', () => {

    // FIXME: create a function that takes an
    // object and merges it with the existing payload Object
    // Is there a way to protect success and error?

    it('should merge data with payload', () => {

      let res = mockResponse({});
      let apiResponse = new ApiResponse(res);
      apiResponse.attach({
        some: 'data'
      });

      apiResponse.payload.should.have.property('some').and.to.equal('data');

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
      res.json.should.have.been.calledOnceWith({success: false, error: {type: 'INVALID_CREDENTIALS', message: 'This is the error message'}});

    });

  });



});
