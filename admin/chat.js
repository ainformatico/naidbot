var utils   = require('../src/utils'),
    parser  = require('../src/parser'),
    command =
    {
      trigger     : 'chat',
      description : 'Send a message to a contact',
      action      : function(opts)
      {
        var params = opts.params; //get the opts
        if(params)
        {
          params = parser.get_opts(opts.params.join(' ')); //get the opts
          if(params.u && params.m) //all the needed params
          {
            utils.log(utils.interpolate(this.i18n.chat.chatting, {user : params.u}));
            this.chat(params.u, params.m);
          }
        }
      }
    };
module.exports = command;
