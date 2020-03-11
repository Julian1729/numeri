const bcrypt = require('bcrypt');

/**
 * Validate password
 * @param  {String}  password Raw password
 * @return {mixed}   Array of password errors or true
 */
exports.validatePassword = (password = '') => {

  const errors = [];

  // must be longer than 7 characters
  if(password === '' || password.length < 7){
    errors.push('must be longer than 7 characters');
  }

  // must contain capital letter
  if(!password.match(/[A-Z]/)){
    errors.push('must contain at least 1 capital letter')
  }

  // must contain special char e.g. !@#$%^&*(),.?":{}|<>
  if(!password.match(/[!@#$%^&*(),.?":{}|<>]/)){
    errors.push('must contain at least 1 special character');
  }

  // must contain 1 number
  if(!password.match(/[0-9]/)){
    errors.push('must contain at least 1 number');
  }

  return errors;

}

/**
 * Hash raw password for saving to db
 * @param  {String} rawPassword User inputted raw password
 * @return {Promise} Promise with hash
 */
exports.hashPassword = rawPassword => new Promise((resolve, reject) => {

    bcrypt.hash(rawPassword, 10, function(err, hash) {
      if (err) reject(err)
      resolve(hash)
    });

})
