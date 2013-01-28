var command =
    {
      trigger  : /(\d+) years (\w+)/,
      response : function(trigger, match)
      {
        var num = match[0],
            adj = match[1];
        return "You said '" + trigger + "', with params: '" + num + "' and '" + adj + "'";
      }
    };
module.exports = command;
