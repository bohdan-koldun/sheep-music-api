const PasswordReset = use('App/Models/PasswordReset');
const User = use('App/Models/User');

class ResetPasswordController {
  async reset({ request, response }) {
    const data = request.only([
      'email',
      'token',
      'password',
    ]);

    const user = await User.query()
      .where('email', data.email)
      .firstOrFail();

    const passwordReset = await PasswordReset.query()
      .where('email', data.email)
      .where('token', data.token)
      .firstOrFail();

    user.password = data.password;
    await user.save();

    passwordReset.delete();

    response.send({
      message: "Password set successfully"
    })
  }
}

module.exports = ResetPasswordController;
