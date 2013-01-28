var utils   = require('../src/utils'),
    parser  = require('../src/parser'),
    command =
    {
      trigger     : 'remove trigger',
      description : 'Remove a trigger from db',
      action      : function(opts)
      {
        var params = parser.get_opts(opts.params.join(' ')), //get the opts
            type; //save the type
        utils.log(utils.interpolate(this.i18n.contacts.deleting, {user : params.u}));
        if(params.n) //TODO: notify user
        {
          if(params.g)
          {
            type = 'group';
          }
          if(params.u)
          {
            type = 'user';
          }
          this.remove_trigger(
          {
            type        : type,
            trigger     : params.n.toLowerCase(), //always lower case
            user        : params.u,
            group       : params.g
          });
        }
      }
    };
module.exports = command;
