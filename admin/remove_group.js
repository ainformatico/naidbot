var utils   = require('../src/utils'),
    parser  = require('../src/parser'),
    command =
    {
      trigger     : 'remove group',
      description : 'Remove a group from db',
      action      : function(opts)
      {
        var group = opts.params[0];
        utils.log(utils.interpolate(this.i18n.groups.removing, {group : group}));
        this.remove_group(group);
      }
    };
module.exports = command;
