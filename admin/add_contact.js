var utils   = require('../src/utils'),
    parser  = require('../src/parser'),
    command =
    {
      trigger     : 'add contact',
      description : 'Add a contact',
      action      : function(opts)
      {
        var params = parser.get_opts(opts.params.join(' ')); //get the opts
        utils.log(utils.interpolate(this.i18n.contacts.adding, {user : params.u, groups : params.g || ''}));
        this.add_contact(params.u, params.d, (typeof params.g === 'string') ? [params.g] : params.g);
      }
    };
module.exports = command;
