'use strict';

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with profiles
 */
class ProfileController {
  /**
   * Display a single profile.
   * GET profile
   *
   */
  async show({ auth }) {
    return auth.user;
  }

  /**
   * Update profile details.
   * PUT profile
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   */
  async update({ request, auth }) {
    const { user } = auth;

    const data = request.only([
      'first_name',
      'last_name',
      'email',
    ]);

    const password = request.input('password');

    user.merge(data);

    if (password) {
      user.password = password;
    }

    await user.save();

    return user;
  }
}

module.exports = ProfileController;
