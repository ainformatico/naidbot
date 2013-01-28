var utils   = require('../src/utils'),
    parser  = require('../src/parser'),
    command =
    {
      trigger     : 'run tests',
      description : 'Run all the tests',
      action      : function(opts)
      {
        var params = opts.params; //get the opts
        if(params)
        {
          params = parser.get_opts(opts.params.join(' ')); //get the opts
          if(params.u)
          {
            this._test(params.u);
          }
        }
      }
    };
module.exports = command;
