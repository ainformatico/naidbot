var utils   = require('../src/utils'),
    parser  = require('../src/parser'),
    command =
    {
      trigger     : 'unblock contact',
      description : 'Unblock a contact',
      action      : function(opts)
      {
        var params = parser.get_opts(opts.params.join(' ')); //get the opts
        utils.log(utils.interpolate(this.i18n.contacts.unblocking, {user : params.u}));
        this.unblock_contact(params.u);
      }
    };
module.exports = command;
