var utils   = require('../src/utils'),
    command =
    {
      trigger     : 'jid',
      description : 'Get the JID',
      action      : function(opts)
      {
        var _this = this,
            username = _this._bot.username.toString();
        utils.log(username);
        _this.chat(_this._config.security.main_admin, username);
      }
    };
module.exports = command;
