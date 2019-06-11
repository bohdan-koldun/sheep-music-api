/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route');

// Health Check
Route.get('/', () => console.log("Health check at " + (new Date()).toISOString()));

Route.group(() => {

  // Auth
  Route.post('register', 'RegisterController.register').validator('Auth/Register');
  Route.post('login', 'LoginController.login').validator('Auth/Login');
  Route.post('refresh/token', 'LoginController.refreshToken');
  Route.get('login/facebook', 'LoginController.facebookRedirect');
  Route.get('facebook/callback', 'LoginController.facebookCallback');

  Route.post('password/forgot', 'ForgotPasswordController.send').validator('Auth/ForgotPassword');
  Route.post('password/reset', 'ResetPasswordController.reset').validator('Auth/ResetPassword');

}).namespace('Auth');


Route.group(() => {

  // Profile
  Route.get('profile', 'ProfileController.show');
  Route.put('profile', 'ProfileController.update').validator('Profile');

}).middleware(['auth']);


Route.group(() => {
  Route.get('test', 'ProfileController.test');

}).middleware(['auth:jwt', 'is: moderator']);