var command =
    {
      trigger     : 'help',
      description : 'List all the available commands for user',
      action      : function(opts)
      {
        opts.naidbot.help();
      }
    };
module.exports = command;
