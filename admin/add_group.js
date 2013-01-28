var utils   = require('../src/utils'),
    parser  = require('../src/parser'),
    command =
    {
      trigger     : 'add group',
      description : 'Add a group to db',
      action      : function(opts)
      {
        var group = opts.params[0];
        utils.log(utils.interpolate(this.i18n.groups.adding, {group : group}));
        this.add_group(group);
      }
    };
module.exports = command;
