const BaseValidator = use('App/Validators/BaseValidator');

class ResetPassword extends BaseValidator {
  get rules() {
    return {
      email: 'required|string|email|max:255',
      token: 'required|string',
      password: 'required|string|min:6|confirmed',
    };
  }
}

module.exports = ResetPassword;
