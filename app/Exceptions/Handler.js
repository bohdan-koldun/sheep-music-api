const Env = use('Env');
const BaseExceptionHandler = use('BaseExceptionHandler');
const bugsnag = require('bugsnag');

bugsnag.register(Env.get('BUGSNAG_API_KEY'), { releaseStage: Env.get('NODE_ENV') });

/**
 * This class handles all exceptions thrown during
 * the HTTP request lifecycle.
 *
 * @class ExceptionHandler
 */
class ExceptionHandler extends BaseExceptionHandler {
  /**
   * Handle exception thrown during the HTTP lifecycle
   *
   * @method handle
   *
   * @param  {Object} error
   * @param  {Object} options.request
   * @param  {Object} options.response
   *
   * @return {void}
   */
  async handle(error, {request, response}) {

    let data = {
      type: error.name,
      errors: error.messages
    };

    switch (error.name) {
      case 'ValidationException': {
        data.message = "Validation failed. Make sure you have filled all fields correctly";
        break
      }
      default: {
        data.message = error.message.split(": ")[1];
        break
      }
    }

    if (Env.get('APP_DEBUG') === 'true') {
      data.stack = error.stack
    }

    return response.status(error.status).json(data);
  }

  /**
   * Report exception for logging or debugging.
   *
   * @method report
   *
   * @param  {Object} error
   * @param  {Object} options.request
   *
   * @return {void}
   */
  async report(error, {request}) {
    bugsnag.notify(error, {
      data: request.all(),
      headers: request.headers()
    })
  }
}

module.exports = ExceptionHandler
