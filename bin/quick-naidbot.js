/**
 * Send messages through naidbot
 *
 * @author Alejandro El Informático <aeinformatico@gmail.com>
 *
 * @version 0.1
 *
 * */

var net         = require('net'),
    optparse    = require('optparse'),
    fs          = require('fs'),
    utils       = require('../src/utils'),
    validate    = require('../src/validate'),
    socket_path = '/tmp/',
    socket_name = 'naidbot',
    opts =
    [
      ['-u', '--user user', 'The user'],
      ['-m', '--message message', 'The message'],
      ['-s', '--socket socket', 'The socket name to use for this instance'],
      ['-h', '--help', 'Display the help information']
    ],
    args   = new optparse.OptionParser(opts),
    socket = new net.Socket(),
    message =
    {
      user    : '',
      content : ''
    },
    path;
args.banner = 'Usage: quick-naidbot [options]'; //help banner
args.on('socket', function(opt, value)
{
  socket_name = value;
});
args.on('user', function(opt, value)
{
  message.user = value;
});
args.on('message', function(opt, value)
{
  message.content = value;
});
args.on('help', function(opt, value)
{
  utils.log(args.toString()); //print the help
  process.exit(0); //stop the process with 0 status
});
args.parse(process.argv); //parse the args
path = socket_path + socket_name + '.sock';
if(!validate.empty(message.user))
{
  utils.exists(
  {
    file    : path,
    success : function()
    {
      socket.connect(path); //connect to socket
      if(process.stdin.readable) //we got data from stdin
      {
        process.stdin.resume();
        message.content = fs.readFileSync('/dev/stdin').toString();
        process.stdin.pause();
      }
      socket.write('u:' + message.user + ' m:"' + message.content + '"', 'utf-8'); //we user a custom {separator}
      socket.end(); //close the socket
    },
    error : function()
    {
      utils.log('Socket "' + path + '" does not exists!');
    }
  });
}
else
{
  utils.log(args.toString()); //print the help
}
