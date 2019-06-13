'use strict';

const {test, trait} = use('Test/Suite')('Profile');
const User = use('App/Models/User');

trait('Test/ApiClient');
trait('Auth/Client');

test('User can view profile', async ({assert, client}) => {

  const user = await User.create({
    first_name: "Jack",
    last_name: "Daniels",
    email: "jackdaniels@example.com",
    password: "secret",
  });

  const response = await client
    .get('v1/profile')
    .loginVia(user)
    .end();

  response.assertStatus(200);
  response.assertJSONSubset({
    first_name: "Jack",
    last_name: "Daniels",
    email: "jackdaniels@example.com",
  })
});

test('User can update profile', async ({assert, client}) => {

  const user = await User.create({
    first_name: "Tony",
    last_name: "Stark",
    email: "tonystark@example.com",
    password: "secret",
  });

  const response = await client
    .put('v1/profile')
    .send({
      first_name: "Iron",
      last_name: "Stark",
      email: "ironman@example.com",
    })
    .loginVia(user)
    .end();

  response.assertStatus(200);
  response.assertJSONSubset({
    first_name: "Iron",
    last_name: "Stark",
    email: "ironman@example.com",
  })
});
