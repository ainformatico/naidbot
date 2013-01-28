/**
 * Simple XMPP bot
 *
 * @author Alejandro El Informático <aeinformatico@gmail.com>
 *
 * @version 0.1
 *
 * */

var config   = require('../config'),
    utils    = require('../src/utils'),
    optparse = require('optparse'),
    opts =
    [
      ['-h', '--help', 'Display the help information'],
      ['-s', '--socket socket', 'The socket name to use for this instance']
    ],
    args = new optparse.OptionParser(opts),
    Naidbot = require('../src/naidbot'),
    bot;

args.banner = 'Usage: naidbot [options]'; //help banner
args.on('socket', function(opt, value)
{
  config.bot.socket = value;
});
args.on('help', function(opt, value)
{
  utils.log(args.toString()); //print the help
  process.exit(0); //stop the process with 0 status
});
args.parse(process.argv); //parse the args
bot = new Naidbot(config); //run Naidbot
