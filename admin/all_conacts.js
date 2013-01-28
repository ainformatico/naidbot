var utils   = require('../src/utils'),
    command =
    {
      trigger     : 'all contacts',
      description : 'List all contacts in db',
      action      : function(opts)
      {
        this.all_contacts();
      }
    };
module.exports = command;
