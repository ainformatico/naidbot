var command =
{
  trigger     : 'list intervals',
  description : 'List all intervals',
  action      : function(opts)
  {
    opts.naidbot.list_intervals(opts);
  }
};
module.exports = command;
