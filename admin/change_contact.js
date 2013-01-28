var utils   = require('../src/utils'),
    parser  = require('../src/parser'),
    command =
    {
      trigger     : 'change contact',
      description : 'Change a contact',
      action      : function(opts)
      {
        var params = parser.get_opts(opts.params.join(' ')); //get the opts
        utils.log(utils.interpolate(this.i18n.contacts.updating, {user : params.u}));
        this.update_contact_db(
        {
          user  : params.u,
          group : params.g || ''
        });
      }
    };
module.exports = command;
