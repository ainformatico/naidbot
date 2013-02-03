var plugin =
{
  name        : 'Work mode',
  description : 'Set bot as busy.',
  version     : '1.0',
  enabled     : false,
  action      : function(naidbot)
  {
    var _this = this;
    naidbot.on('connection:online', function()
    {
      _this.status.change('dnd', 'work mode, sorry!');
    });
  }
};
module.exports = plugin;
