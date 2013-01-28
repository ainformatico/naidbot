var utils   = require('../src/utils'),
    command =
    {
      trigger     : 'desc',
      description : 'information of trigger',
      action      : function(opts)
      {
        var trigger = opts.params.join(' ').toLowerCase(); //always lower case
        this.info_trigger(trigger);
      }
    };
module.exports = command;
