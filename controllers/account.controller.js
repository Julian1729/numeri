const errors = require('../Errors');
const { accountServices } = require('../services');
const registrationValidator = require('../helpers/validators/registration.validator');

exports.login = (req, res) => {

  return res.ApiResponse().send();

}

exports.register = async (req, res, next) => {

  // validate data
  const registrationErrors = registrationValidator(req.body);
  if(registrationErrors){
    return res.ApiResponse().error('FORM_VALIDATION', null, registrationErrors).send();
  }

  const ApiResponse = res.ApiResponse();

  const userObject = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    phone: req.body.phone,
    password: req.body.password,
  };

  let registeredUser = null;

  try {

    registeredUser = await accountServices.registerUser(userObject, req.body.referralCode);

  } catch (e) {

    // handle insecure password error
    if(e instanceof errors.InsecurePassword){
      return ApiResponse.error('INSECURE_PASSWORD').send();
    }

    // handle an invalid referral code
    if(e instanceof errors.InvalidReferral){
      console.log(e);
      return ApiResponse.error('INVALID_REFERRAL_CODE', null, { code: e.refCode }).send();
    }

    // handle existing email
    if(e instanceof errors.EmailAlreadyExists){
      return ApiResponse.error('EMAIL_ALREADY_EXISTS').send();
    }

  }

  // login w/ passport helper function
  req.login(registeredUser, (err) => {

    if(err){
      return next(err);
    }

    return ApiResponse.data('redirect', '/dashboard').send();

  });

};
