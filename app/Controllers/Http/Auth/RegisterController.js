const User = use('App/Models/User');

class RegisterController{
  async register({ request, auth }) {
    const data = request.only([
      'first_name',
      'last_name',
      'email',
      'password',
    ]);

    const user = await User.create(data);

    return await auth.generate(user)
  }
}

module.exports = RegisterController;
