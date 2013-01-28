var utils   = require('../src/utils'),
    command =
    {
      trigger     : 'all groups',
      description : 'List all groups in db',
      action      : function(opts)
      {
        this.all_groups();
      }
    };
module.exports = command;
