var utils   = require('../src/utils'),
    parser  = require('../src/parser'),
    command =
    {
      trigger     : 'block contact',
      description : 'Block a contact',
      action      : function(opts)
      {
        var params = parser.get_opts(opts.params.join(' ')); //get the opts
        utils.log(utils.interpolate(this.i18n.contacts.blocking, {user : params.u}));
        this.block_contact(params.u);
      }
    };
module.exports = command;
