var command =
{
  trigger     : 'remove interval',
  description : 'Remove an interval',
  action      : function(opts)
  {
    opts.naidbot.clean_interval(
    {
      name   : opts.params[0]
    });
  }
};
module.exports = command;
