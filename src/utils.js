var fs     = require('fs'),
    net    = require('net'),
    _log   = require('log'),
/**
 * Utils
 *
 * @author Alejandro El Informático <aeinformatico@gmail.com>
 *
 * @version 0.1
 *
 * @class utils
 *
 * */
utils =
{
  /**
   * Contorl the debug mode
   *
   * */
  DEBUG : false,

  /**
   * Print debug lines
   *
   * @param {} data the data to print
   *
   * */
  debug : function(data)
  {
    if(this.DEBUG)
    {
      console.log(data);
      logger.debug(data);
    }
  },

  /**
   * Print. Just log.
   *
   * @param {} data the data to print
   *
   * */
  log : function(data)
  {
    console.log(data);
    logger.info(data);
  },

  /**
   * Error. Just log.
   *
   * @param {} data the data to print
   *
   * */
  error : function(data)
  {
    this.log(data);
    logger.error(data);
  },

  /**
   * Warning. Just log.
   *
   * @param {} data the data to print
   *
   * */
  warning : function(data)
  {
    logger.warning(data);
  },

  /**
  * Interpolate Hash
  * Default syntax: #{hash}
  *
  * @param {string} str hash string
  *
  * @param {object} o object dictionary
  *
  * */
  interpolate : function(str, o)
  {
    for (var property in o)
    {
      var pattern = new RegExp('#{' + property + '}', "g");
      str = str.replace(pattern, o[property]);
    }
    return str;
  },

  /**
   * Get the username without the JID
   *
   * @param {string} username the username
   *
   * */
  get_user: function(username)
  {
    return username.replace(/\/.*$/, '');
  },

  /**
   * Get the current date
   *
   * @return the date
   *
   * */
  get_date: function()
  {
    return new Date().getTime();
  },

  /**
   * Get the current formated date, yyyyMMddhhmmss
   *
   * @return the date
   *
   * */
  get_formated_date : function()
  {
    var date    = new Date(),
        year    = this.pad_int_with_zeros(date.getFullYear()),
        month   = this.pad_int_with_zeros((date.getMonth() + 1)),
        day     = this.pad_int_with_zeros(date.getDate()),
        hour    = this.pad_int_with_zeros(date.getHours()),
        minutes = this.pad_int_with_zeros(date.getMinutes()),
        seconds = this.pad_int_with_zeros(date.getSeconds());
    return year + month + day + hour + minutes + seconds;
  },

  /**
   * Pad the int with zeros
   *
   * @param {string} n the number
   *
   * @return the number as string
   *
   * */
  pad_int_with_zeros : function(n)
  {
    return (parseInt(n) < 10 ? "0" : "") + n;
  },

  /**
   * Check if file exists
   *
   * @param {object} opts object options
   *
   * @param {string} opts.file the file
   *
   * @param {function} opts.exec check for execution perms in file
   *
   * @param {function} opts.success callback if all went ok
   *
   * @param {function} opts.error callback if file does not exits
   *
   * */
  exists : function(opts)
  {
    var _this = this;
    fs.stat(opts.file, function(err, stat)
    {
      if(err === null)
      {
        if(opts.exec)
        {
          if(_this.has_executable({mode : stat.mode}))
          {
            (typeof opts.success === 'function') && opts.success();
          }
          else
          {
            (typeof opts.no_exec === 'function') && opts.no_exec();
          }
        }
        else
        {
          (typeof opts.success === 'function') && opts.success(stat);
        }
      }
      else if(err.code === 'ENOENT') //file not exists
      {
        (typeof opts.error === 'function') && opts.error(err.code);
      }
    });
  },

  /**
   * Check if a file is executable at lest by a person, group or other
   *
   * */
  has_executable : function(opts)
  {
    var _this = this,
        mode = opts.mode,
        octal = new String(_this.dec_to_oct(mode)).toString(),
        perms = parseInt(octal.substr(octal.length - 3), 10);
    return (perms % 2 == 0) ?
      false :
      true;
  },

  /**
   * Convert decimal to octal
   *
   * @param {int} x decimanl
   *
   * @return octal value
   *
   * */
  dec_to_oct : function(x)
  {
    var num = x,
        cnt = 0,
        octal = [];
    while (num != 0)
    {
      octal[cnt] = num % 8;
      num = parseInt(num / 8, 10);
      cnt++;
    }
    return parseInt(octal.reverse().join(''));
  },

  /**
   * Check if the config file is OK
   *
   * @return {boolean} true when OK
   *
   * @return {boolean} false when not OK
  **/
  check_config: function(opts)
  {
    var file = __dirname + '/../_config.js';
    this.exists(
    {
      file : file,
      success : function()
      {
        var config = require('../_config.js');
        if (
          typeof config.username !== 'undefined' &&
          config.username !== '' &&
          typeof config.password !== 'undefined' &&
          config.password !== '' &&
          typeof config.main_admin !== 'undefined' &&
          config.main_admin !== ''
        )
        {
          opts.success();
        }
        else
        {
          opts.error();
        }
      },
      error : function()
      {
        utils.log(file);
        opts.error();
      }
    });
  },

  /**
   * Create a socket
   *
   * @param {object} opts object options
   *
   * @param {string} opts.file the file name
   *
   * @param {function} opts.on_data callback for data event
   *
   * @return {function} close close and remove the socket
   *
   * */
  create_socket : function(opts)
  {
    var listen_on; //where to listen
    if(opts.file)
    {
      listen_on = opts.file + '.sock';
    }
    if(opts.port)
    {
      listen_on = opts.port;
    }
    var _this = this,
        socket = new net.Socket(),
        server = net.createServer(function(sock)
        {
          _this.debug('Client connected to socket');
          sock.on('data', function(data)
          {
            var _data = data.toString().replace(/\r\n$/, ''); //remove EOL
            _this.debug('Reiciving data to socket: ' + _data);
            _this.log('Socket data from "' + this.remoteAddress  +'" ' + data);
            (typeof opts.on_data === 'function') && opts.on_data(_data);
          });
          sock.on('connect', function()
          {
            _this.log('Socket connection from: ' + this.remoteAddress);
          });
        }).listen(listen_on),
        /**
         * @private
        **/
        methods =
        {
          /**
           * @private
          **/
          close : function()
          {
            server.close();
          }
        };
    server.on('close', function()
    {
      _this.debug('Closing the socket...');
      if(opts.file)
      {
        utils.exists(
        {
          file : opts.file,
          success : function()
          {
            fs.unlinkSync(opts.file);
          }
        });
      }
    });
    return methods;
  },

  /**
    * Remove leading and trailing white space from a string
    *
    * @param {string} s string to trim
    *
    * @return {string}
    *
    * */
  trim : function(s)
  {
    return this.rtrim(this.ltrim(s));
  },

  /**
    * Remove leading white space from a string
    *
    * @param {string} s string to ltrim
    *
    * @return {string}
    *
    * */
  ltrim : function(s)
  {
    return s.replace(/^\s+/,"");
  },

  /**
    * Remove trailing white space from a string
    *
    * @param {string} s string to rtrim
    *
    * @return {string}
    *
    * */
  rtrim : function(s)
  {
    return s.replace(/\s+$/,"");
  },

  /**
   * Synchronous mkdir
   *
   * @param {string} path the path
   *
   * */
  mkdir : function(path)
  {
    fs.mkdirSync(path);
  },

  /**
    * Create the log file
    *
    * @return {log} log instance
    *
    * */
  create_log: function()
  {
    var log_dir = "log/",
        log_name = 'naidbot-' + utils.get_formated_date() + '.log';
    //check if the dir exists
    //FIXME: after upgrade node use native methods to check and create dirs
    try
    {
      utils.mkdir(log_dir);
    }
    catch(e){}
    return new _log('debug', fs.createWriteStream(log_dir + log_name))
  },
},
logger = utils.create_log();

module.exports = utils;
