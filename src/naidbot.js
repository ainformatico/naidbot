var xmpp       = require('node-xmpp'),
    fs         = require('fs'),
    utils      = require('./utils'),
    parser     = require('./parser'),
    scripts    = require('./scripts'),
    monguitron = require('./monguitron'),
    i18n       = require('../i18n/en'),
    sandbox    = require('./sandbox'),
    eventer    = require('./eventer');

/**
 * Simple XMPP bot
 *
 * @author Alejandro El Informático <aeinformatico@gmail.com>
 *
 * @version 0.1
 *
 * @class Naidbot
 *
 * @contructor
 *
 * */
var Naidbot = function(opts)
{
  var _this = this;
  _this._config = opts;
  _this.i18n = i18n;
  utils.check_config(
  {
    success : function()
    {
      _this.connect(); //connect
      _this._eventer.on('connection:presence', function()
      {
        //TODO: just for testing, remove this in the future
        _this._sandbox.register('jid', function()
        {
          return _this._bot.username;
        });
      });
      _this._set_socket(); //create the socket
      _this._load_commands( //load admin commands
      {
        path     : __dirname + '/../admin/',
        commands : _this._admin_commands,
        triggers : _this._all_admin_commands
      });
      _this._load_commands( //load external commands
      {
        path     : __dirname + '/../commands/',
        commands : _this._common_commands,
        triggers : _this._all_common_commands
      });
      _this._load_commands( //load fallback messages
      {
        path     :    __dirname + '/../fallback/',
        commands : _this._fallback_commands,
        triggers : _this._all_fallback_commands
      });
      _this._load_plugins( //load plugins
      {
        path : __dirname + '/../plugins/'
      });
    },
    error : function()
    {
     utils.log(i18n.error.config.not_config);
    }
  });
};

Naidbot.prototype =
{
  /**
   * Save the interval
   *
   * @private
   *
   * */
  _interval : '',
  /**
   * Socket path
   *
   * @private
   *
   * */
  _socket_path : '/tmp/',
  /**
   * Socket name
   *
   * @private
   *
   * */
  _socket_name : 'naidbot',
  /**
   * Save the socket
   *
   * @private
   *
   * */
  _socket : '',
  /**
   * Send the alive beacon
   *
   * @private
   *
   * */
  _beacon: function(time)
  {
    var _this = this;
    _this._interval = setInterval(function()
    {
      utils.debug(i18n.connection.beacon);
      _this._send //set as connected
      (
        new xmpp.Element('iq',
          {
            type : 'get',
            id   : utils.get_date()
          })
        .c('query',
        {
          xmlns: 'jabber:iq:roster'
        })
      );
    }, time);
  },
  /**
   * Save the connection item
   *
   * @private
   *
   * */
  _connection : '',
  /**
   * Send via the connection item
   *
   * @private
   *
   * */
  _send : function(element)
  {
    this._connection.send(element);
  },
  /**
   * Bot privated info
   *
   * @private
   *
   * @property {string} username
   *
   * @property {string} contacts
   *
   * */
  _bot :
  {
    /**
     * username
     *
     * @type string
     *
     * @private
     *
     * */
    username : '',
    /**
     * contacts
     *
     * @type string
     *
     * @private
     *
     * */
    contacts : ''
  },
  /**
   * Check if the contact is main admin
   *
   * @private
   *
   * */
  _is_admin: function(user)
  {
    return (utils.get_user(user) === this._config.security.main_admin); //check for admin FIXME: check for all admin users!!!
  },
  /**
   * Run tests for each available internal command
   *
   * @param {string} contact the contact to test
   *
   * @private
   *
   * */
  _test : function(contact)
  {
    var _this = this,
        tests =
        [
          function(contact)
          {
            _this.delete_contact(contact);
          },
          function(contact)
          {
            _this.add_contact(contact, 'namename', 'groupname');
          },
          function(contact)
          {
            _this.block_contact(contact);
          },
          function(contact)
          {
            _this.update_contact(contact, 'namename', 'groupname');
          },
          function(contact)
          {
            _this.get_contacts();
          },
          function(contact)
          {
            _this.unblock_contact(contact);
          },
          function(contact)
          {
            _this.set_status('away', 'is away');
            _this.set_status('dnd', 'is dnd');
            _this.set_status('chat', 'is chat');
          },
          function(contact)
          {
            _this.chat(_this._config.security.main_admin, _this._bot.username.toString());
          },
          function(contact)
          {
            utils.log("Last test reached!!!");
            _this._rl.close();
            process.exit();
          }
        ],
        i = 0;
    setInterval(function()
    {
      utils.log('Executing test: ' + i);
      tests[i](contact);
      i++;
    }, 4000);
  },

  /**
   * Create the file or port socket
   *
   * @private
   *
   * */
  _set_socket : function()
  {
    var _this = this,
        parse_data = function(data, socket)
        {
          var opts = parser.get_opts(data);
          if(opts.m) //we need at least the message
          {
            if(opts.g) //if groups, send a broadcast
            {
              _this.broadcast(
              {
                notify  : false, //prevent main_admin notify
                groups  : opts.g,
                message : opts.m
              });
            }
            else if(opts.u) //just sent the message to the user
            {
              _this.chat(opts.u, opts.m);
            }
          }
        };
    _this._socket = utils.create_socket(
    {
      file    : _this._socket_path + (_this._config.bot.socket || _this._socket_name),
      on_data : parse_data
    });

    //port
    if(_this._config.bot.socket_port)
    {
      utils.create_socket(
      {
        port    : _this._config.bot.socket_port,
        on_data : parse_data
      });
    }
  },
  /**
   * Connect the client
   *
   * */
  connect : function()
  {
    var _this = this;
    _this._connection = new xmpp.Client( // establish a connection
    {
      jid       : _this._config.server.username,
      password  : _this._config.server.password,
      host      : _this._config.server.host,
      port      : _this._config.server.port,
      reconnect : _this._config.server.reconnect
    });
    _this._connection.on('rawStanza', function(stanza) //set the raw stanza event, for debug proposes
    {
      utils.debug("<< " + stanza.toString());
    });
    _this._connection.on('error', function(e) //set the error event
    {
      utils.debug(_this._bot.username);
      utils.debug('[xmpp error]: ' + e);
    });
    _this._connection.on('stanza', function(stanza)
    {
      utils.debug('----> ' + stanza.attrs.type + ' <------');
      switch(stanza.attrs.type)
      {
        case 'subscribed':
          utils.log(utils.interpolate(i18n.contacts.adding, {user : stanza.attr.from}));
        break;
        case 'subscribe': //want access
          utils.log(utils.interpolate(i18n.contacts.has_subscribed, {user : stanza.attrs.from}));
          _this.chat(_this._config.security.main_admin, utils.interpolate(i18n.contacts.want_access, {user : stanza.attrs.from})); //notify
        break;
        case 'result':
          utils.debug('>>>>>');
          utils.debug(stanza);
          var check = stanza.children[0];
          if(check)
          {
            _this._bot.contacts = check.children;
          }
          utils.debug('<<<<<');
        break;
        case 'error':
          utils.debug('[ERROR]');
          utils.debug(stanza);
          utils.debug('[/ERROR]');
        break;
      }
      if(stanza.is('presence'))
      {
        if(typeof _this._bot.username === 'object') //prevent remove the JID
        {
          return;
        }
        _this._bot.username = new xmpp.JID(stanza.attrs.to);
        _this._eventer.emit('connection:presence');
      }
      if(stanza.attrs.type && stanza.attrs.type.match(/groupchat|direct/))
      {
        utils.debug("Rejecting:");
        utils.debug(stanza);
        return; //prevent errors
      }
      if(stanza.is('message'))
      {
        if(stanza.attrs.type !== 'error') //is not an error
        {
          if(stanza.children[0].name == 'composing') //prevent 'composing' status
          {
            return;
          }
          utils.debug('=====================');
          utils.debug(stanza);
          utils.debug('=====================');
          var text = stanza.getChild('body'),
              user = stanza.attrs.from,
              num_triggers = _this._config.bot.triggers,
              common       = false, //common command
              admin        = false; //admin command
          if(!text) //prevent empty messages
          {
            return;
          }
          text = text.getText(); //get the message text
          utils.log(utils.interpolate(i18n.chat.message_reicived, {user: utils.get_user(stanza.attrs.from), text : text}));
          if(_this._is_admin(user))
          {
            admin = _this._exec_admin(
            {
              user    : user,
              command : text
            });
          }
          if(!admin) //is not admin
          {
            common = _this._exec_common(
            {
              user : user,
              command : text
            });
          }
          if(!admin && !common) //not admin or internal, check database
          {
            _this._get_command( //get the command
            {
              user: user,
              trigger : text,
              num_triggers : num_triggers
            });
          }
        }
        else
        {
          utils.error('[xmpp error]: ' + stanza);
          return;
        }
      }
    }); //set the stanza event, do all the magic
    var readline = require('readline');
    _this._rl = readline.createInterface(process.stdin, process.stdout, null);
    _this._rl.setPrompt('-> ');
    _this._rl.on('line', function(cmd)
    {
      _this._exec_admin( //for CLI just admin commands
      {
        user    : _this._config.security.main_admin,
        command : cmd
      });
    });
    _this._rl.on('close', function()
    {
      utils.log(i18n.stat.closing);
      _this.logout(i18n.stat.maintance);
      process.exit();
    });
    process.on('exit', function()
    {
      _this._socket.close(); //remove the socket
      utils.log(i18n.stat.exit);
    });
    _this._connection.on('online', function(stanza)
    {
      utils.log(i18n.stat.online);
      _this._beacon(15000); //send the beacon to tell we are alive
      _this._send //set as connected
      (
        new xmpp.Element('presence')
          .c('show')
          .t(_this._config.bot.stat)
          .up()
          .c('status')
          .t(_this._config.bot.message)
      );
      _this.chat //notify admin we are online
      (
        _this._config.security.main_admin,
        utils.interpolate
        (
          i18n.connection.ready,
          {
            date : new Date().toString()
          }
        )
      );
      _this._eventer.emit('connection:online');
    });
  },
  /**
   * Unblock a contact
   *
   * @param {string} contact the contact
   *
   * */
  unblock_contact : function(contact)
  {
    var _this = this;
    utils.log(utils.interpolate(i18n.contacts.unblocking, {user : contact}));
    _this._send
    (
      new xmpp.Element('iq',
      {
        type: 'set',
        from: _this._bot.username,
        id: utils.get_date()
      })
      .c('query',
      {
        xmlns : 'jabber:iq:roster'
      })
      .c('item',
      {
        jid: contact,
        subscription : 'both'
      })
    );
    _this._send
    (
      new xmpp.Element('presence',
      {
        type: 'subscribe',
        id: utils.get_date(),
        from: _this._bot.username,
        to : contact
      })
    );
    _this._send
    (
      new xmpp.Element('presence',
      {
        type: 'subscribed',
        id: utils.get_date(),
        from: _this._bot.username,
        to : contact
      })
    );
    _this._send
    (
      new xmpp.Element('presence')
        .c('show')
        .t(_this._config.bot.stat)
        .up()
        .c('status')
        .t(_this._config.bot.message)
    );
    this.chat(_this._config.security.main_admin, 'Recived UNBLOCK request for ' + contact);
  },
  /**
   * Block a contact
   *
   * @param {string} contact the contact
   *
   * @param {boolean} remove remove the contact from the contacts list
   *
   * */
  block_contact : function(contact, remove)
  {
    var _this = this;
    utils.log(utils.interpolate(i18n.contacts.blocking, {user : contact}));
    _this._send
    (
      new xmpp.Element('iq',
      {
        type: 'set',
        from: _this._bot.username,
        id: utils.get_date()
      })
      .c('query',
      {
        xmlns : 'jabber:iq:roster'
      })
      .c('item',
      {
        jid: contact,
        subscription : 'none'
      })
    );
    _this._send
    (
      new xmpp.Element('presence',
      {
        type: 'unsubscribe',
        id: utils.get_date(),
        to : contact
      })
    );
    _this._send
    (
      new xmpp.Element('presence',
      {
        type: 'unavailable',
        id : 'remove1',
        from: _this._bot.username,
        to : contact
      })
    );
    remove && this.delete_contact(contact);
    this.chat(_this._config.security.main_admin, 'Recived BLOCK request for ' + contact);
  },
  change_trigger : function(opts)
  {
    switch(opts.type)
    {
      case 'group':
        monguitron.add_group_trigger(
        {
          trigger : opts.trigger,
          group   : opts.group
        });
      break;
      case 'user':
        monguitron.add_user_trigger(
        {
          trigger : opts.trigger,
          user    : opts.user
        });
      break;
      case 'description':
        monguitron.mod_description_trigger(
        {
          trigger     : opts.trigger,
          description : opts.description
        });
      break;
      case 'script':
        monguitron.mod_script_trigger(
        {
          trigger     : opts.trigger,
          script : opts.script
        });
      break;
    }
  },
  /**
   * Add a trigger
   *
   * @param {object} opts object options
   *
   * */
  add_trigger : function(opts)
  {
    monguitron.add_trigger(
    {
      trigger     : opts.trigger.toLowerCase(), //always to lower
      users       : opts.users, //must be an array
      groups      : opts.groups, //must be an array
      script      : opts.script,
      description : opts.description
    });
  },
  /**
   * Remove a trigger
   *
   * @param {object} opts object options
   *
   * */
  remove_trigger : function(opts)
  {
    switch(opts.type)
    {
      case 'user':
        monguitron.remove_user_trigger(
        {
          trigger : opts.trigger,
          user    : opts.user
        });
      break;
      case 'group':
        monguitron.remove_group_trigger(
        {
          trigger : opts.trigger,
          group   : opts.group
        });
      break;
      default:
        monguitron.remove_trigger(
        {
          trigger : opts.trigger
        });
      break;
    }
  },
  /**
   * Add a group
   *
   * @param {string} name the name
   *
   * */
  add_group : function(name)
  {
    monguitron.add_group(
    {
      group : name
    });
  },
  /**
   * Remove a group
   *
   * @param {string} name the name
   *
   * */
  remove_group : function(name)
  {
    monguitron.remove_group(
    {
      group : name
    });
  },
  /**
   * Add a contact
   *
   * @param {string} contact the contact
   *
   * @param {string} name the contact name
   *
   * @param {string} group the contact group
   *
   * */
  add_contact : function(contact, name, group)
  {
    var _this = this;
    group = group || _this._config.bot.contacts.default_group;
    name  = name || contact.replace(/@.*$/, '');
    _this._send
    (
      new xmpp.Element('presence',
      {
        type: 'subscribe',
        from: _this._bot.username,
        to : contact,
        id: utils.get_date()
      })
    );
    _this._send
    (
      new xmpp.Element('iq',
      {
        type: 'set',
        from: _this._bot.username,
        id: utils.get_date()
      })
      .c('query',
      {
        xmlns : 'jabber:iq:roster'
      })
      .c('item',
      {
        jid: contact,
        name : name
      })
      .c('group').t(group)
    );
    //for db
    monguitron.add_user(
    {
      user   : contact,
      groups : group
    });
    this.chat(_this._config.security.main_admin, 'Recived ADD contact for ' + contact);
  },
  /**
   * Groups of contact
   *
   * @param {string} contact contact name
   *
  **/
  contact_groups : function(contact)
  {
    var _this = this;
    monguitron.user_groups({
      user : contact,
      success : function(docs)
      {
        (docs) && _this.chat(_this._config.security.main_admin, docs.toString());
      }
    });
  },
  /**
   * All groups
   *
  **/
  all_groups : function()
  {
    var _this = this;
    monguitron.all_groups({
      success : function(docs)
      {
        (docs) && _this.chat(_this._config.security.main_admin, docs.toString());
      }
    });
  },
  /**
   * All contacts
   *
  **/
  all_contacts : function()
  {
    var _this = this;
    monguitron.all_users({
      success : function(docs)
      {
        (docs) && _this.chat(_this._config.security.main_admin, docs.join('\n'));
      }
    });
  },
  /**
   * Trigger info
   *
   * @param {string} trigger trigger name
   *
  **/
  info_trigger : function(trigger)
  {
    var _this = this;
    monguitron.info_trigger({
      trigger : trigger,
      success : function(docs)
      {
        if(docs)
        {
          _this.chat(_this._config.security.main_admin, utils.interpolate(_this.i18n.command.desc,
          {
            trigger : trigger,
            desc    : docs.description,
            users   : docs.user,
            groups  : docs.group,
            script  : docs.script
          }));
        }
        else
        {
          var is_admin = _this._all_admin_commands.indexOf(trigger),
              is_common,
              command;
          if(is_admin !== -1) //found as admin command
          {
            command = _this._admin_commands[is_admin];
            _this.chat(_this._config.security.main_admin, utils.interpolate(_this.i18n.command.short_desc,
            {
              trigger : command.trigger,
              desc    : command.description
            }));
            return; //prevent further actions
          }
          is_common = _this._all_common_commands.indexOf(trigger);
          if(is_common !== -1) //found as common command
          {
            command = _this._common_commands[is_common];
            _this.chat(_this._config.security.main_admin, utils.interpolate(_this.i18n.command.short_desc,
            {
              trigger : command.trigger,
              desc    : command.description
            }));
            return; //prevent further actions
          }
          _this.chat(_this._config.security.main_admin, 'Trigger not found'); //fallback, not found
        }
      }
    });
  },
  /**
   * Update a contact
   *
   * @param {object} opts object options
   *
   * @param {string} opts.user the user
   *
   * @param {string} opts.group the group
   *
   * */
  update_contact_db : function(opts)
  {
    if(opts.group)
    {
      monguitron.add_group_user(
      {
        user  : opts.user,
        group : opts.group
      });
    }
  },
  /**
   * Update a contact from db
   *
   * @param {string} contact the contact
   *
   * @param {string} name the contact name
   *
   * @param {string} grup the contact group
   *
   * */
  update_contact : function(contact, name, group)
  {
    var _this = this;
    group = group || _this._config.bot.contacts.default_group;
    name  = name || contact.replace(/@.*$/, '');
    _this._send
    (
      new xmpp.Element('iq',
      {
        type: 'set',
        from: _this._bot.username,
        id: utils.get_date()
      })
      .c('query',
      {
        xmlns : 'jabber:iq:roster'
      })
      .c('item',
      {
        jid: contact,
        name : name
      })
      .c('group').t(group)
    );
    _this.chat(_this._config.security.main_admin, 'Recived UPDATE contact for ' + contact);
  },
  /**
   * Get the contacts list
   *
   * */
  get_contacts : function()
  {
    var _this = this;
    utils.log("Contacts: ");
    _this._send
    (
      new xmpp.Element('iq',
      {
        type: 'get',
        from: _this._bot.username,
        id: utils.get_date()
      })
      .c('query',
      {
        xmlns : 'jabber:iq:roster'
      })
    );
    this.chat(_this._config.security.main_admin, 'Recived LIST contacts');
    return _this._bot.contacts;
  },
  /**
   * Delete a contact from db
   *
   * @param {string} contact the contact
   *
   * @param {string} name the contact name
   *
   * @param {string} grup the contact group
   *
   * */
  delete_contact_db : function(opts)
  {
    monguitron.remove_group_user(
    {
      user  : opts.user,
      group : opts.group
    });
  },
  /**
   * Delete a contact
   *
   * @param {string} contact the contact
   *
   * */
  delete_contact : function(contact)
  {
    var _this = this;
    _this._send
    (
      new xmpp.Element('iq',
      {
        type: 'set',
        from: _this._bot.username,
        id: utils.get_date()
      })
      .c('query',
      {
        xmlns : 'jabber:iq:roster'
      })
      .c('item',
      {
        jid: contact,
        subscription : 'remove'
      })
    );
    monguitron.remove_user( //remove from db
    {
      user : contact
    });
    this.chat(_this._config.security.main_admin, 'Recived DELETE contact for ' + contact);
  },
  /**
   * Send a message to a contact
   *
   * @param {string} contact the contact
   *
   * @param {string} message the message
   *
   * */
  chat : function(contact, message)
  {
    var _this = this;
    _this._eventer.emit('chat:message', message);
    _this._send
    (
      new xmpp.Element('message',
      {
        to : contact,
        type : 'chat'
      }).c('body').t(message)
    );
  },
  /**
   * Send broadcast message all users or defined groups
   *
   * @param {object} opts object options
   *
   * @param {array} opts.groups all the groups
   *
   * @param {string} opts.message the message
   *
   * */
  broadcast : function(opts)
  {
    var _this = this;
    monguitron.users_group(
    {
      groups : opts.groups,
      success : function(users)
      {
        if(users && users.length > 0)
        {
          if(typeof opts.notify === 'undefined' || opts.notify)
          {
            _this.chat(_this._config.security.main_admin, utils.interpolate(_this.i18n.chat.broadcast, {groups : opts.groups || 'all groups'}));
          }
          for(var i = 0; i < users.length; i++)
          {
            _this.chat(users[i], opts.message);
          }
        }
      }
    });
  },
  /**
   * Logout the client
   *
   * @param {string} message message to show as status message
   *
   * */
  logout : function(message)
  {
    var _this = this;
    _this.chat(_this._config.security.main_admin, 'Recived LOGOUT');
    utils.log(i18n.stat.logging_out);
    _this._send
    (
      new xmpp.Element('presence',
      {
        type : 'unavailable'
      })
      .c('status').t(message || i18n.utils.logout)
    );
  },
  /**
   * Set the client status
   *
   * @param {string} stat the jabber stat
   *
   * @param {string} message the status message
   *
   * */
  set_status : function(stat, message)
  {
    var _this = this;
    stat    = stat || _this._config.bot.stat;
    message = message || _this._config.bot.message;
    _this._send
    (
      new xmpp.Element('presence')
        .c('show')
        .t(stat)
        .up()
        .c('status')
        .t(message)
    );
    this.chat(_this._config.security.main_admin, 'Recived SET status to: ' + stat + '(' + message + ')');
  },
  /**
   * Get the command
   *
   * @private
   *
   * @param {object} opts object options
   *
   * @param {string} opts.user the user
   *
   * @param {string} opts.trigger the trigger
   *
   * @param {string} opts.num_triggers number of triggers
   *
   * */
  _get_command : function(opts)
  {
    var _this = this;
    monguitron.triggers(
    {
      user         : utils.get_user(opts.user),
      num_triggers : opts.num_triggers,
      success      : function(data)
      {
        if(data)
        {
          var command = parser.get_command(opts.trigger, data, opts.num_triggers);
          if(command)
          {
            monguitron.script(
            {
              trigger : command.command,
              success : function(data)
              {
                if(data)
                {
                  _this.chat(opts.user, utils.interpolate(i18n.script.executing, {script : data}));
                  scripts.run(
                  {
                    command : data.toLowerCase(), //always to lower
                    params  : command.params,
                    success : function(output)
                    {
                      if(output)
                      {
                        _this.chat(opts.user, output);
                      }
                      else
                      {
                        _this._notify({user : opts.user, message : utils.interpolate(i18n.error.command.security, {file : file})});
                      }
                    },
                    no_exec : function(file)
                    {
                      _this._notify({user : opts.user, message : utils.interpolate(i18n.error.file.no_exec, {file : file})});
                    },
                    script_error : function(error)
                    {
                      if(!error)
                      {
                        _this._notify({user : opts.user, message : i18n.error.command.security});
                      }
                      else
                      {
                        _this._notify({user : opts.user, message : utils.interpolate(i18n.error.command.script_error, {script : data, error : error})});
                      }
                    },
                    error : function(message)
                    {
                      _this._notify({user : opts.user, message : utils.interpolate(message, {file : data})});
                    }
                  });
                }
                else
                {
                  //TODO: this is just a quickly workaround
                  if(_this._get_fallback_command({user: opts.user, message : opts.trigger}) === false)
                  {
                    _this._notify({user : opts.user, message : utils.interpolate(i18n.error.command.not_found, {command : data})});
                  }
                }
              }
            });
          }
          else
          {
            //TODO: this is just a quickly workaround
            if(_this._get_fallback_command({user: opts.user, message : opts.trigger}) === false)
            {
              _this._notify({user : opts.user, message : utils.interpolate(i18n.error.command.not_found, {command : opts.trigger})});
            }
          }
        }
      }
    });
  },
  /**
   * Notify for non-found commands, may be for security reasons
   *
   * @private
   *
   * @params {object} opts object options
   *
   * @params {string} opts.user the user
   *
   * @params {string} opts.message the message
   *
   * */
  _notify : function(opts)
  {
    var _this = this;
    _this._config.security.notify_not_found && _this.chat(opts.user, opts.message);
    utils.warning(opts.message);
  },
  /**
   * Close Naidbot
   *
   * @private
   *
   * */
  _exit : function()
  {
    this._rl.close();
    process.exit();
  },
  /**
   * All the admin commands
   *
   * @private
   *
   * */
  _admin_commands : [],
  /**
   * All the admin triggers, just to improve the trigger search
   *
   * @private
   *
   * */
  _all_admin_commands : [],
  /**
   * All the external commands
   *
   * @private
   *
   * */
  _common_commands : [],
  /**
   * All the external triggers, just to improve the trigger search
   *
   * @private
   *
   * */
  _all_common_commands : [],
  /**
   * Fallback commands
   *
   * @private
   *
   * */
  _fallback_commands : [],
  /**
   * Event holder
   *
   * @private
   *
   * */
  _eventer : new eventer.Eventer(),
  /**
   * Sandbox
   *
   * @private
   *
   * */
  _sandbox : sandbox,
  /**
   * Save all the plugins
   *
   * @private
   *
   * */
  _plugins : {},
  /**
   * Fallback triggers, just to improve the trigger search
   *
   * @private
   *
   * */
  _all_fallback_commands : [],
  /**
   * Load plugins
   *
   * @private
   *
   * @param {object} opts object options
   *
   * @param {array} opts.commands where to save the commands
   *
   * @param {array} opts.triggers where to save the triggers
   *
   * */
  _load_plugins : function(opts)
  {
    var _this = this,
        files = fs.readdirSync(opts.path); //load all the files
    for(var i = 0, l_files = files.length; i < l_files; i++)
    {
      var file    = files[i],
          command = require(opts.path + file);
      _this._plugins[command.name] = command; //save the plugin
      command.action.apply(_this._sandbox._data, [_this._eventer]); //init the plugin
    }
  },
  /**
   * Load commands from dir
   *
   * @private
   *
   * @param {object} opts object options
   *
   * @param {array} opts.commands where to save the commands
   *
   * @param {array} opts.triggers where to save the triggers
   *
   * */
  _load_commands : function(opts)
  {
    var _this = this,
        files = fs.readdirSync(opts.path); //load all the files
    for(var i = 0, l_files = files.length; i < l_files; i++)
    {
      var file    = files[i],
          command = require(opts.path + file);
      opts.commands.push(command); //save the commands
      opts.triggers.push(command.trigger); //save the triggers
    }
  },
  /**
   * Load fallback messages
   *
   * @private
   *
   * @param {object} opts object options
   *
   * */
  _get_fallback_command : function(opts)
  {
    var _this = this,
        found = false,
        match = function(settings)
        {
          var matches = settings.cmd.match(settings.regex);
          if(matches)
          {
            if(typeof settings.response === 'function')
            {
              matches.shift(); //remote the whole match
              //TODO: create and use a sandbox
              _this.chat(opts.user, settings.response.apply({}, [settings.cmd, matches])); //for security set an empty context
            }
            else
            {
              _this.chat(opts.user, settings.response);
            }
            found = true;
          }
        };
    for(var i = 0, l_commands = _this._all_fallback_commands.length; i < l_commands; i++)
    {
      var command  = _this._all_fallback_commands[i],
          response = _this._fallback_commands[i].response;
      if(command instanceof Array)
      {
        for(var j = 0, l_triggers = command.length; j < l_triggers; j++)
        {
          var current = command[j];
          match(
          {
            cmd      : opts.message,
            regex    : current,
            response : response
          });
        }
      }
      else
      {
        match(
        {
          cmd      : opts.message,
          regex    : command,
          response : response
        });
      }
    }
    return found;
  },
  /**
   * execute a common command
   *
   * @private
   *
   * @param {object} opts object options
   *
   * @param {string} opts.command the command
   *
   * @param {string} opts.user the user
   *
   * */
  _exec_common : function(opts)
  {
    var _this = this,
        user  = opts.user,
        cmd   = parser.get_command(opts.command, _this._all_common_commands, _this._config.bot.triggers);
    if(cmd)
    {
      for(var i = 0, l_commands = _this._common_commands.length; i < l_commands; i++)
      {
        var command = _this._common_commands[i];
        if(command.trigger === cmd.command)
        {
          command.action(
          {
            user    : user,
            command : cmd.command,
            params  : cmd.params,
            naidbot :
            {
              help : function()
              {
                _this._help({user : utils.get_user(opts.user)});
              },
              chat : function(user, message)
              {
                _this.chat(user, message);
              },
              set_interval : function(opts)
              {
                opts.user = user; //the current user
                _this._set_interval(opts);
              },
              list_intervals : function(opts)
              {
                opts.user = user; //the current user
                _this._list_intervals(opts);
              },
              clean_interval : function(opts)
              {
                opts.user = user; //the current user
                _this._clean_interval(opts);
              },
              exec_command : function(opts)
              {
                var common = false;
                //TODO: create a unique function to get a common command
                common = _this._exec_common( //check for common comnand
                {
                  user    : opts.user,
                  command : opts.command
                });
                if(!common)
                {
                  _this._get_command(
                  {
                    user         : opts.user,
                    trigger      : opts.command,
                    num_triggers : _this._config.bot.triggers
                  });
                }
              }
            }
          });
          return true;
        }
      }
    }
  },
  /**
   * execute an admin command
   *
   * @private
   *
   * @param {object} opts object options
   *
   * @param {string} opts.command the command
   *
   * @param {string} opts.user the user
   *
   * */
  _exec_admin : function(opts)
  {
    var _this = this,
        cmd   = parser.get_command(opts.command, _this._all_admin_commands, _this._config.bot.triggers);
    if(cmd)
    {
      for(var i = 0, l_commands = _this._admin_commands.length; i < l_commands; i++)
      {
        var command = _this._admin_commands[i];
        if(command.trigger === cmd.command)
        {
          command.action.apply(_this,
          [
            {
              user    : opts.user,
              command : cmd.command,
              params  : cmd.params,
              naidbot : _this
            }
          ]);
          return true;
        }
      }
    }
  },
  /**
  * Save all the intervals
  *
  * @private
  *
  * */
  _interval_stack : [],
  /**
   * Clean an interval
   *
   * @private
   *
   * @param {object} opts object options
   *
   * @param {string} opts.name interval name
   *
   * */
  _clean_interval : function(opts)
  {
    var _this = this;
    if(typeof _this._interval_stack[opts.user] !== 'undefined')
    {
      for(var i = 0, l_intervals = _this._interval_stack[opts.user].length; i < l_intervals; i++)
      {
        var current = _this._interval_stack[opts.user][i];
        if(current.name === opts.name)
        {
          _this.chat(opts.user, utils.interpolate(i18n.interval.removing, {name: current.name, time : current.time, command : current.command}));
          clearInterval(current.interval); //clear the interval
          _this._interval_stack[opts.user].splice(i, 1); //remove the interval
          break; //stop further action
        }
      }
    }
  },
  /**
   * Create an interval
   *
   * @private
   *
   * @param {object} opts object options
   *
   * @param {string} opts.name interval name
   *
   * @param {function} opts.action the function to execute
   *
   * @param {int} opts.time interval time
   *
   * */
  _set_interval : function(opts)
  {
    var _this = this,
        weight = [];
    weight['s'] = 1000; //one sec
    weight['m'] = 60000; //one min
    weight['h'] = 3600000; //one hour
    if(opts.time.match(/^\d+(s|m|h){1,1}$/)) //match our format
    {
      var format = opts.time.slice(-1),
          value  = opts.time.slice(0, -1),
          total  = weight[format] * value,
          common = false, //is a common command?
          success_callback; //save the success callback
      if(total >= weight['s'] && total <= (24 * weight['h'])) //one sec, one day
      {
        if(typeof _this._interval_stack[opts.user] === 'undefined') //user has intervals?
        {
          _this._interval_stack[opts.user] = []; //add the user to the stack
        }
        _this._clean_interval( //just to prevent duplicates
        {
          user : opts.user,
          name : opts.name,
          time : opts.time
        });
        _this.chat(opts.user, utils.interpolate(i18n.interval.adding, {name : opts.name, time : opts.time, command : opts.command}));
        success_callback = function()
        {
          _this._interval_stack[opts.user].push(
          {
            name     : opts.name,
            time     : opts.time,
            command  : opts.command,
            interval : setInterval(function()
            {
              _this.chat(opts.user, utils.interpolate(i18n.interval.executing, {name : opts.name, time : opts.time, command : opts.command}));
              (typeof opts.action === 'function') && opts.action();
            }, total)
          });
        }
        if(_this._all_common_commands.indexOf(opts.command) !== -1) //find a common command
        {
          success_callback();
          common = true; //set as common command
        }
        if(!common)
        {
          monguitron.all_member_triggers( //find the commmand in db
          {
            user    : utils.get_user(opts.user),
            success : function(res)
            {
              if(res && res.length > 0 && res.indexOf(opts.command) !== -1) //the command exists
              {
                success_callback();
              }
              else
              {
                _this.chat(opts.user, utils.interpolate(i18n.error.interval.not_exists, {command : opts.command}));
              }
            }
          });
        }
      }
      else
      {
        _this.chat(opts.user, i18n.error.interval.time);
      }
    }
    else
    {
      _this.chat(opts.user, i18n.error.interval.format);
    }
  },
  /**
   * List all intervals
   *
   * @private
   *
   * @param {object} opts object options
   *
   * */
  _list_intervals : function(opts)
  {
    var _this = this, user = _this._interval_stack[opts.user];
    var msg = "";
    if(typeof user !== 'undefined')
    {
      var intervals = "";
      for(var i = 0, l_intervals = user.length; i < l_intervals; i++)
      {
        var current = user[i];
        intervals += utils.interpolate(i18n.interval.list, {name: current.name, time : current.time, command : current.command})+"\n";
      }
      if(intervals !== "")
      {
        msg = intervals;
      }
      else
      {
        msg = i18n.interval.no_intervals;
      }
    }
    else
    {
      msg = i18n.interval.no_intervals;
    }
    _this.chat(opts.user, msg);
  },
  /**
   * Print all the available commands for user
   *
   * @private
   *
   * @params {object} opts.object options
   *
   * @params {string} opts.user the user
   *
   * */
  _help : function(opts)
  {
    var _this = this;
    monguitron.all_member_triggers(
    {
      all : true,
      user : opts.user,
      num_triggers : _this._config.bot.triggers,
      success : function(data)
      {
        if(data)
        {
          var output = '';
          for(var i = 0, l_data = data.length; i < l_data; i++)
          {
            var current = data[i];
            output += current.name + ': ' + current.description + '\n';
          }
          for(i = 0, l_data = _this._common_commands.length; i < l_data; i++)
          {
            var current = _this._common_commands[i];
            output += current.trigger + ': ' + current.description + '\n';
          }
          if(_this._is_admin(opts.user)) //if is admin, print all the admin commands
          {
            output += i18n.command.admin;
            for(var i = 0, l_commands = _this._admin_commands.length; i < l_commands; i++)
            {
              var current = _this._admin_commands[i];
              output += current.trigger + ': ' + current.description + '\n';
            }
          }
          _this.chat(opts.user, utils.interpolate(i18n.command.list, {commands : output}));
        }
      }
    });
  }
};

module.exports = Naidbot;
