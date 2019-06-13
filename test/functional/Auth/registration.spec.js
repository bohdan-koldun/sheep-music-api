'use strict';

const {test, trait} = use('Test/Suite')('Registration');

trait('Test/ApiClient');

test('User can register', async ({assert, client}) => {

  const response = await client
    .post('register')
    .send({
      first_name: "John",
      last_name: "Doe",
      email: "johndoe@example.com",
      password: "secret",
      password_confirmation: "secret",
    })
    .end();

  response.assertStatus(200);
  response.assertJSONSubset({
    type: "bearer",
    refreshToken: null
  })
});
