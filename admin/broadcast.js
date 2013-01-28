var utils   = require('../src/utils'),
    parser  = require('../src/parser'),
    command =
    {
      trigger     : 'broadcast',
      description : 'Send a message to all contacts or specified groups',
      action      : function(opts)
      {
        var params = opts.params; //get the opts
        if(params)
        {
          params = parser.get_opts(opts.params.join(' ')); //get the opts
          this.broadcast({groups : params.g, message : params.m});
          utils.log(utils.interpolate(this.i18n.chat.broadcast, {groups : params.g || 'all groups'}));
        }
      }
    };
module.exports = command;
