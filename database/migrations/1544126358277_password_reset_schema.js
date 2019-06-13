/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class PasswordResetSchema extends Schema {
  up() {
    this.create('password_resets', (table) => {
      table.increments();
      table.timestamps();
      table.string('email').notNullable();
      table.string('token').notNullable();
    });
  }

  down() {
    this.drop('password_resets');
  }
}

module.exports = PasswordResetSchema;
