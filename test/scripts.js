var utils = require('../src/utils'),
    exec = require('child_process').exec,
    test =
    {
      inputs : ['ls -l', 'not-found.sh', '/etc/init.d/ssh restart', '~/bot/test/scripts/ls.sh', '~/bot/test/scripts/node.js'],
      exec : function(cmd, opts)
      {
        exec(cmd, opts || {}, function(error, stdout, stderr)
        {
          utils.log("ERROR:");
          utils.log(error);
          utils.log("STDOUT:");
          utils.log(stdout);
          utils.log("STDERR:");
          utils.log(stderr);
        })
      },
      run_tests : function()
      {
        var _this = this,
            l_inputs = _this.inputs.length;
        for(var i = 0; i < l_inputs; i++)
        {
          var current = _this.inputs[i];
          utils.log(Array(50).join('-'));
          utils.log('command: ' + current);
          _this.exec(current);
        }
      }
    };

test.run_tests();
