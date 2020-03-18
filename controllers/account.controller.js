const errors = require('../Errors');
const { accountServices } = require('../services');

exports.checkAuthentication = (req, res) => {

  if(!req.isAuthenticated()){
    return res.send('not logged in')
  }

  return res.send('logged in here');

};

exports.login = (req, res) => {

  return res.ApiResponse().data('redirect', '/dashboard').send();

}

exports.logout = (req, res) => {

  req.logout();
  return res.ApiResponse().send();

}

exports.register = async (req, res, next) => {

  const ApiResponse = res.ApiResponse();

  const userObject = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
  };

  let registeredUser = null;

  try {

    registeredUser = await accountServices.registerUser(userObject, req.body.referralCode);

  } catch (e) {

    // handle insecure password error
    if(e instanceof errors.InsecurePassword){
      return ApiResponse.error('INSECURE_PASSWORD').send();

    }else if (e instanceof errors.InvalidReferral){
      // handle an invalid referral code
      return ApiResponse.error('INVALID_REFERRAL_CODE', null, { code: e.refCode }).send();

    }else if(e instanceof errors.EmailAlreadyExists){
      // handle existing email
      return ApiResponse.error('EMAIL_ALREADY_EXISTS').send();

    }else{
      return next(e);
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

exports.forgotPassword = async (req, res, next) => {

  const email = req.body.email;

  // // validate email
  // const emailErrors = validate(email, {
  //   presence: true,
  //   email: true,
  // });
  //
  // if(emailErrors){
  //   return res.ApiResponse().error('', null, emailErrors).send();
  // }

  let token = null;

  try {

    token = await accountServices.setForgotPasswordToken(email);

  } catch (e) {

    if(e instanceof errors.InvalidCredentials){
      return res.ApiResponse()
        .error('EMAIL_NOT_REGISTERED', `User with email "${email}" not found`)
        .send();
    }else{
      return next(e);
    }

  }

  // OPTIMIZE: send user email with link

  // send back token
  return res.ApiResponse().data('token', token).send();

};

exports.resetPassword = async (req, res, next) => {

  const token = req.params.token;
  const userId = req.params.userId;
  const password = req.body.password;

  let user = null;

  try {

    user = await accountServices.resetPassword(userId, token, password);

  } catch (e) {

    console.log(e);
    if(e instanceof errors.InsecurePassword){
      return res.ApiResponse()
        .error('INSECURE_PASSWORD', null, e.getErrors())
        .send();
    }else if (e instanceof errors.UserNotFound){
      // OPTIMIZE: send 401 here?
      return res.ApiResponse()
        .error('USER_NOT_FOUND')
        .send();
    }else if(e instanceof errors.InvalidToken){
      return res.ApiResponse()
        .error('INVALID_TOKEN', null, {token})
        .send();
    }else{
      return next(e);
    }

  }

  // login w/ passport helper function
  req.login(user, err => {

    if(err){
      return next(err);
    }

    // OPTIMIZE: add flash message
    // to be displayed after redirect

    return res.ApiResponse()
      .data('redirect', '/dashboard')
      .send();

  });

};
