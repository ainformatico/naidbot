var plugin =
{
  name        : 'First plugin',
  description : 'Plugin example',
  version     : '1.0',
  action      : function(naidbot)
  {
    var _this = this;
    naidbot.on('connection:online', function()
    {
      console.log("I'm connected!");
    });

    naidbot.on('connection:offline', function()
    {
      console.log("Closing connection...");
    });

    naidbot.on('connection:presence', function()
    {
      console.log("The jid is: " + _this.jid());
    });

    naidbot.on('chat:received', function(data)
    {
      console.log("new message from: " + data.from + ', ' + data.message);
    });
  }
};
module.exports = plugin;
