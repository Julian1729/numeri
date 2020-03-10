class InsecurePassword extends Error {

    constructor(errors){
        super(errors);
        this.name = "InsecurePassword";
        this.errors = errors;
    }

    getErrors(){
      return this.errors;
    }

    getUserMessage(){
      return `Password must be ${this.errors.join(', ')}`;
    }

}

class InvalidReferral extends Error {

    constructor(refCode){
        super(refCode);
        this.name = "InvalidReferral"
        this.refCode = refCode;
    }

}

class EmailAlreadyExists extends Error {

    constructor(message){
        super(message);
        this.name = "EmailAlreadyExists"
    }

}

class InvalidCredentials extends Error {

    constructor(message){
        super(message);
        this.name = "InvalidCredentials"
    }

}

module.exports = {
  InsecurePassword,
  InvalidReferral,
  EmailAlreadyExists,
  InvalidCredentials,
}
