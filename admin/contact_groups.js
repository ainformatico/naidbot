var utils   = require('../src/utils'),
    command =
    {
      trigger     : 'groups of',
      description : 'Groups of contact',
      action      : function(opts)
      {
        var contact = opts.params[0];
        this.contact_groups(contact);
      }
    };
module.exports = command;
