/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class UserSchema extends Schema {
  up() {
    this.create('users', (table) => {
      table.increments();
      table.string('name', 80).notNullable();
      table.string('slug', 15);
      table.string('email', 254).notNullable().unique();
      table.string('password', 60).notNullable();
      table.string('avatar', 500);
      table.string('gender', 15);
      table.timestamps();
    });
  }

  down() {
    this.drop('users');
  }
}

module.exports = UserSchema;
