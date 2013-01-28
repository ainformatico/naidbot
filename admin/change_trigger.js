var utils   = require('../src/utils'),
    parser  = require('../src/parser'),
    command =
    {
      trigger     : 'change trigger',
      description : 'Change a trigger to db',
      action      : function(opts)
      {
        var params = parser.get_opts(opts.params.join(' ')), //get the opts
            type; //modification type
        if(params.n) //TODO: notify user
        {
          utils.log(utils.interpolate(this.i18n.triggers.changing, {trigger : params.n}));
          if(params.u)
          {
            type = 'user';
          }
          if(params.g)
          {
            type = 'group';
          }
          if(params.d)
          {
            type = 'description';
          }
          if(params.s)
          {
            type = 'script';
          }
          this.change_trigger(
          {
            type        : type,
            trigger     : params.n.toLowerCase(), //always lower case
            user        : params.u,
            group       : params.g,
            script      : params.s,
            description : params.d
          });
        }
      }
    };
module.exports = command;
