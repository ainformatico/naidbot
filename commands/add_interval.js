var utils   = require('../src/utils'),
    parser  = require('../src/parser'),
    command =
    {
      trigger     : 'add interval',
      description : 'Add an interval',
      action      : function(opts)
      {
        var params = opts.params; //get the opts
        if(params)
        {
          params = parser.get_opts(opts.params.join(' ')); //get the opts
          if(params.n && params.t && params.c) //has name, time and commmand
          {
            opts.naidbot.set_interval(
            {
              name    : params.n,
              time    : params.t,
              command : params.c,
              action  : function()
              {
                opts.naidbot.exec_command(
                {
                  user    : opts.user,
                  command : params.c.toString()
                });
              }
            });
          }
          else
          {
            opts.naidbot.chat(opts.user, this.i18n.error.interval.command);
          }
        }
      }
    };
module.exports = command;
