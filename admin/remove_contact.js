var utils   = require('../src/utils'),
    parser  = require('../src/parser'),
    command =
    {
      trigger     : 'remove contact',
      description : 'Remove a contact',
      action      : function(opts)
      {
        var params = parser.get_opts(opts.params.join(' ')); //get the opts
        utils.log(utils.interpolate(this.i18n.contacts.deleting, {user : params.u}));
        if(params.g) //has groups?
        {
          this.delete_contact_db( //delete that group
          {
            user  : params.u,
            group : params.g || ''
          });
        }
        else //we have no groups, delete the contact
        {
          this.delete_contact(params.u);
        }
      }
    };
module.exports = command;
