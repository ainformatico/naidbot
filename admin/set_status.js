var utils   = require('../src/utils'),
    parser  = require('../src/parser'),
    command =
    {
      trigger     : 'set',
      description : 'Set the bot status',
      action      : function(opts)
      {
        var params = opts.params; //get the opts
        if(params)
        {
          params = parser.get_opts(opts.params.join(' ')); //get the opts
        }
        else
        {
          params =
          {
            s : false,
            m : false
          };
        }
        utils.log(utils.interpolate(this.i18n.stat.setting, {stat : params.s, message : params.m}));
        this.set_status(params.s, params.m);
      }
    };
module.exports = command;
