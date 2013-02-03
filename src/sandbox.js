var utils = require('./utils');

/**
 * Sandbox
 *
 * @author Alejandro El Informático <aeinformatico@gmail.com>
 *
 * @version 0.1
 *
 * @class Sandbox
 *
 * @contructor
 *
 * */
var Sandbox = function()
{
  /**
   * Save all the functions
   *
   * @private
   *
   * */
  this._data = {};
  /**
  * Register a new function
  *
  * @private
  *
  * @param {string} name for the function
  *
  * @param {function} f function
  *
  * */
  this.register = function(name, f)
  {
    if(utils.trim(name).length && typeof f === 'function')
    {
      utils.log("registering for sandbox: " + name);
      utils.namespace(this._data, name, f);
    }
  }
}

module.exports = new Sandbox();
