const BaseValidator = use('App/Validators/BaseValidator');

class Register extends BaseValidator {
  get rules() {
    return {
      first_name: 'required|string|max:255',
      last_name: 'required|string|max:255',
      email: 'required|string|email|max:255|unique:users',
      password: 'required|string|min:6|confirmed',
    };
  }
}

module.exports = Register;
