var parser = require('../src/parser'),
    utils  = require('../src/utils'),
    test =
    {
      L : 2,
      inputs : ['map', 'map me barcelona ciudad', 'halt', 'service start apache2', 'broadcast server info', 'service ssh restart', 'compila proyecto', 'deploy'],
      tests  : ['map', 'map me', 'halt', 'service start', 'service', 'broadcast server info'],
      run_tests : function()
      {
        var _this = this,
            l_inputs = _this.inputs.length;
        utils.log('TRIGGERS: ' + _this.L);
        utils.log('INPUTS: ' + _this.inputs.join(', '));
        utils.log('COMMANDS: ' + _this.tests.join(', '));
        for(var i = 0; i < l_inputs; i++)
        {
          var current = _this.inputs[i],
              command = parser.get_command(current, _this.tests, _this.L);
          if(command)
          {
            utils.log('---------------------------')
            utils.log('=====> ' + current);
            if(command.params) //has params?
            {
              utils.log('Command: ' + command.command + ' => ' + command.params);
            }
            else //no params
            {
              utils.log('Command: ' + command.command);
            }
          }
        }
      }
    };

test.run_tests();
