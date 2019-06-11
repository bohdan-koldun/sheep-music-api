const User = use('App/Models/User');

class LoginController {
  async login({
    request,
    response,
    auth
  }) {
    const {
      email,
      password
    } = request.all();
    const user = await User.findByOrFail('email', email);
    await user.loadAll();
    const token = await auth.withRefreshToken().attempt(email, password);
    return response.send({
      user,
      token,
      message: 'User successfully login'
    });
  }

  async refreshToken({
    request,
    auth
  }) {
    const {
      refreshToken
    } = request.all();
    return await auth
      .newRefreshToken()
      .generateForRefreshToken(refreshToken)
  }

  async facebookRedirect({
    ally
  }) {
    await ally.driver('facebook').redirect()
  }

  async facebookCallback({
    ally,
    response,
    auth
  }) {

    const fbUser = await ally.driver('facebook').getUser();

    const userData = {
      email: fbUser.getEmail(),
      name: fbUser.getName(),
      facebook_id: fbUser.getId(),
      password: [...Array(10)].map(i=>(~~(Math.random()*36)).toString(36)).join(''),
      avatar: fbUser.getAvatar(),
    };

    const whereClause = {
      email: fbUser.getEmail()
    }

    const user = await User.findOrCreate(whereClause, userData);

    if (!user) {
      user = await User.create(userData, false);
      await user.confirmation().update({
        email_code: null,
        email_confirmed: true,
      });
    }

    if (!user.facebook_id) {
      user.facebook_id = userData.facebook_id;
      await user.save();
      await user.confirmation().update({
        email_code: null,
        email_confirmed: true,
      });
    }

    await user.loadAll();
    const token = await auth.withRefreshToken().generate(user);
    return response.send({
      user,
      token
    }, 'User successfully login');
  }

}

module.exports = LoginController;