const PasswordReset = use('App/Models/PasswordReset');
const Mail = use('Mail');
const Env = use('Env');

class ForgotPasswordController {
  async send({ request, response }) {
    const email = request.input('email');

    const token = Math.random().toString(36).substring(2, 15)
      + Math.random().toString(36).substring(2, 15);

    await PasswordReset.create({
      email,
      token,
    });

    await Mail.send('emails.forgot_password', { token }, (message) => {
      message.from(Env.get('MAIL_FROM'));
      message.subject('Password recovery');
      message.to(email);
    });

    response.send({
      message: "Password recovery instructions sent"
    })
  }
}

module.exports = ForgotPasswordController;
