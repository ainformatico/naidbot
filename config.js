var config     = require('./_config'),
    app_config =
    {
      server :
      {
        username  : config.username,
        password  : config.password,
        host      : config.host || 'talk.google.com',
        port      : config.port || 5222,
        reconnect : true
      },
      security :
      {
        main_admin : config.main_admin || '',
        notify_not_found : true
      },
      bot :
      {
        stat     : config.stat || 'chat',
        message  : config.message  || 'Just a node bot!',
        triggers : 3,
        contacts :
        {
          default_group : config.default_group || 'users',
          admin_group   : config.admin_group || 'admin'
        }
      }
    };

module.exports = app_config;
