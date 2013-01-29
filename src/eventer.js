var util   = require('util'),
    events = require('events');

/**
 * Control events
 *
 * @author Alejandro El Informático <aeinformatico@gmail.com>
 *
 * @version 0.1
 *
 * @class Eventer
 *
 * @contructor
 *
 * */
var controller =
{
  Eventer : function()
  {
    events.EventEmitter.call(this);
  }
}
util.inherits(controller.Eventer, events.EventEmitter);

module.exports = controller;
