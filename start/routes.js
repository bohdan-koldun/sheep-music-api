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
  Route.post('register', 'RegisterController.register').validator('V1/Auth/Register');
  Route.post('login', 'LoginController.login').validator('V1/Auth/Login');
  Route.post('refresh/token', 'LoginController.refreshToken');
  Route.get('login/facebook', 'LoginController.facebookRedirect');
  Route.get('facebook/callback', 'LoginController.facebookCallback');

  Route.post('password/forgot', 'ForgotPasswordController.send').validator('V1/Auth/ForgotPassword');
  Route.post('password/reset', 'ResetPasswordController.reset').validator('V1/Auth/ResetPassword');

}).prefix('v1').namespace('V1/Auth');


Route.group(() => {

  // Profile
  Route.get('profile', 'ProfileController.show');
  Route.put('profile', 'ProfileController.update').validator('V1/Profile');

}).middleware(['auth']).prefix('v1').namespace('V1');


Route.group(() => {
  Route.get('test', 'ProfileController.test');

}).middleware(['auth:jwt', 'is: moderator']).prefix('v1').namespace('V1');