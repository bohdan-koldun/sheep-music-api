const BaseValidator = use('App/Validators/V1/BaseValidator');

class Profile extends BaseValidator {
  get rules() {
    const userId = this.ctx.auth.user.id;

    return {
      first_name: 'required|string|max:255',
      last_name: 'required|string|max:255',
      email: `required|string|email|max:255|unique:users,email,id,${userId}`,
      password: 'string|min:6|confirmed',
    };
  }
}

module.exports = Profile;
