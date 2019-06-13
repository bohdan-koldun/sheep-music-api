'use strict';

const {test, trait} = use('Test/Suite')('Password Restore');
const User = use('App/Models/User');
const Mail = use('Mail');

let token = "";

trait('Test/ApiClient');

test('User can forgot password', async ({assert, client}) => {

  Mail.fake();

  const data = {
    first_name: "Andy",
    last_name: "Moor",
    email: "andymoor@example.com",
    password: "secret",
  };

  await User.create(data);

  const response = await client
    .post('v1/password/forgot')
    .send({
      email: data.email,
    })
    .end();

  response.assertStatus(200);
  response.assertJSON({
    message: "Password recovery instructions sent"
  });

  const recentEmail = Mail.pullRecent();

  token = recentEmail.message.html.replace("Your token is ", "").trim();

  assert.equal(recentEmail.message.to[0].address, data.email);
  assert.equal(recentEmail.message.to[0].address, data.email);
  assert.include(recentEmail.message.html, 'Your token is');

  Mail.restore()
});

test('User can reset password', async ({assert, client}) => {

  const response = await client
    .post('v1/password/reset')
    .send({
      email: "andymoor@example.com",
      password: "secret",
      password_confirmation: "secret",
      token
    })
    .end();

  response.assertStatus(200);
  response.assertJSON({
    message: "Password set successfully"
  });

  Mail.restore()
});
