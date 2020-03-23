const HttpStatusCodes = require('http-status-codes');

/**
 * If user not authenticated send 401
 */
exports.shouldBeAuthenticated = (req, res, next) => {

  if(!req.isAuthenticated()){
    return res.status(HttpStatusCodes.UNAUTHORIZED).send();
  }
  next();

}

/**
 * If user is authenticated send redirect to dashboard
 */
exports.shouldNotBeAuthenticated = (req, res, next) => {

  if(req.isAuthenticated()){
    return res.ApiResponse().data('redirect', '/dashboard').send();
  }
  next();

}
