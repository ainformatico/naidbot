var utils   = require('../src/utils'),
    parser  = require('../src/parser'),
    command =
    {
      trigger     : 'add trigger',
      description : 'Add a trigger to db',
      action      : function(opts)
      {
        var params = parser.get_opts(opts.params.join(' ')); //get the opts
        utils.log(utils.interpolate(this.i18n.triggers.adding, {trigger : params.n}));
        if(params.n && params.s && params.d) //TODO: notify user
        {
          this.add_trigger(
          {
            trigger     : params.n,
            users       : params.u || [], //must be an array
            groups      : params.g || [], //must be an array
            script      : params.s,
            description : params.d
          });
        }
      }
    };
module.exports = command;
