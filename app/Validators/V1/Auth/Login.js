const BaseValidator = use('App/Validators/V1/BaseValidator');

class Login extends BaseValidator {
  get rules() {
    return {
      email: 'required|string|email|max:255',
      password: 'required|string',
    };
  }
}

module.exports = Login;
