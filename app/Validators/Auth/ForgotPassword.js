const BaseValidator = use('App/Validators/BaseValidator');

class ForgotPassword extends BaseValidator {
  get rules() {
    return {
      email: 'required|string|email|max:255|exists:users,email',
    };
  }
}

module.exports = ForgotPassword;
