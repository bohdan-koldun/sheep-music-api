const User = use('App/Models/User');
const Role = use('App/Models/Role');

class UserSeeder {
  async run() {
    const roleAdmin = await Role.create({
      name: 'Administrator',
      slug: 'admin',
      description: 'manage administration privileges',
    });

    const roleModerator = await Role.create({
      name: 'Moderator',
      slug: 'moderator',
      description: 'manage moderator privileges',
    });

    const roleUser = await Role.create({
      name: 'User',
      slug: 'user',
      description: 'user privileges',
    });

    const user = await User.create({
      name: 'User',
      email: 'user@example.com',
      password: 'Secret12345',
    });

    const admin = await User.create({
      name: 'Admin',
      email: 'admin@example.com',
      password: 'Secret12345',
    });

    const moderator = await User.create({
      name: 'Modertor',
      email: 'moderator@example.com',
      password: 'Secret12345',
    });

    await user.roles().attach([roleUser.id]);
    await moderator.roles().attach([roleModerator.id]);
    await admin.roles().attach([roleAdmin.id, roleModerator.id]);
  }
}

module.exports = UserSeeder;