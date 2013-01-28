var utils   = require('../src/utils'),
    parser  = require('../src/parser'),
    command =
    {
      trigger     : 'list contacts',
      description : 'List all the contacts',
      action      : function(opts)
      {
        //FIXME: improve this!!!
        var _this = this;
        _this.chat(opts.user, _this.i18n.contacts.getting_list);
        _this.get_contacts();
        setTimeout(function()
        {
          var list = '';
          for(var i = 0; i < _this._bot.contacts.length; i++)
          {
            var current = _this._bot.contacts[i].attrs.jid;
            list += current + '\n';
          }
          _this.chat(opts.user, list);
        }, 5000);
      }
    };
module.exports = command;
