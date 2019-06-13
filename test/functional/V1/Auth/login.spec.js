'use strict';

const {test, trait} = use('Test/Suite')('Login');
const User = use('App/Models/User');

trait('Test/ApiClient');

test('User can login', async ({assert, client}) => {

  await User.create({
    first_name: "Alex",
    last_name: "Murphy",
    email: "alexmurphy@example.com",
    password: "secret",
  });

  const response = await client
    .post('v1/login')
    .send({
      email: "alexmurphy@example.com",
      password: "secret",
    })
    .end();

  response.assertStatus(200);
  response.assertJSONSubset({
    type: "bearer",
    refreshToken: null
  })
});
