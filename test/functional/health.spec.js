'use strict';

const {test, trait} = use('Test/Suite')('Health');

trait('Test/ApiClient');

test('Health check works', async ({assert, client}) => {

  const response = await client
    .get('/')
    .end();

  response.assertStatus(204);
});
