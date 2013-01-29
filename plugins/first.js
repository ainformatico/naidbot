var plugin =
{
  name    : 'first plugin',
  version : '1.0',
  action  : function(naidbot)
  {
    var _this = this;
    naidbot.on('connection:online', function()
    {
      console.log("i'm connected!");
    });

    naidbot.on('connection:presence', function()
    {
      console.log("the jid is: " + _this.jid());
    });

    naidbot.on('chat:message', function(message)
    {
      console.log("new message", message);
    });
  }
};
module.exports = plugin;
