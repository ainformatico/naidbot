/**
 * Basic English i18n implementation
 *
 * */
var i18n =
{
  stat :
  {
    online      : 'Online',
    logging_out : 'Logging out...',
    logout      : 'Logout!',
    setting     : 'Setting #{stat} as #{message}',
    closing     : 'Clossing session...',
    maintance   : 'Maintance reason!',
    exit        : 'Exit!'
  },
  connection :
  {
    ready  : 'We are online at #{date}.',
    beacon : 'Sending alive beacon'
  },
  groups :
  {
    adding   : 'Adding group "#{group}"',
    removing : 'Removing group "#{group}"'
  },
  triggers :
  {
    adding   : 'Adding trigger "#{trigger}"',
    removing : 'Removing trigger "#{trigger}"',
    changing : 'Changing trigger "#{trigger}"'
  },
  contacts :
  {
    adding         : 'Adding contact #{user}',
    added          : 'The user #{user} has added to contacts',
    has_subscribed : '#{user} subscribed to us.',
    want_access    : '#{user} want to add us as contact.',
    unblocking     : 'Unblocking #{user}',
    blocking       : 'Blocking #{user}',
    deleting       : 'Deleting #{user}',
    updating       : 'Updating #{user}',
    getting_list   : 'Gettings the contacts list, this take a while...'
  },
  chat :
  {
    message_reicived : 'Message from #{user} -> #{text}',
    chatting         : 'Chatting to #{user}',
    broadcast        : 'Sending a broadcast message to #{groups}'
  },
  interval :
  {
    adding    : 'Adding interval "#{name}" executing "#{command}" every "#{time}"',
    list      : 'Interval "#{name}" executing "#{command}" every "#{time}"',
    executing : 'Executing interval "#{name}" executing "#{command}" every "#{time}"',
    removing  : 'Removing interval "#{name}" executing "#{command}" every "#{time}"',
    no_intervals  : 'No intervals.'
  },
  command :
  {
    list       : 'Available commands:\n#{commands}',
    admin      : '\n##### Admin #####\n',
    desc       : 'Trigger: #{trigger}\nDescription: #{desc}\nUsers: #{users}\nGroups: #{groups}\nScript: #{script}',
    short_desc : 'Trigger: #{trigger}\nDescription: #{desc}'
  },
  script :
  {
    executing : 'Executing "#{script}"'
  },
  error :
  {
    command :
    {
      not_found    : 'The command "#{command}" does not exists',
      script_error : 'ERROR: The script #{script} has returned error : \n"#{error}"',
      security     : 'We found suspicious code in the command!'
    },
    file :
    {
      not_exists : 'File "#{file}" does not exists!',
      no_exec    : 'File "#{file}" seems no executable for naidbot, please make sure to set the right perms.'
    },
    config :
    {
      not_config : 'Config error: config file "_config.js" not exist or does not contain the necessary parameters'
    },
    interval :
    {
      command    : 'Please use the correct command format: "add interval n:name t:time c:command"',
      format     : 'Please use the correct format for time: 1s, 2m, 3h',
      time       : 'Please verify the time, it must be between 1s and 24h',
      not_exists : 'The command "#{command}" does not exists for you!'
    }
  }
};

module.exports = i18n;
