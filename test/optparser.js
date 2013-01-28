var utils = require('../src/utils'),
    optparser = require('optparse'),
    defaults =
    {
      socket : 'naidbot',
      engine : 'mongodb'
    },
    opts =
    [
      ['-s', '--socket socket', 'The socket name to use'],
      ['-e', '--engine engine', 'The database engine to use'],
      ['-h', '--help', 'Display the help information']
    ],
    cli = new optparser.OptionParser(opts);
cli.banner = "Usage naidbot [options]";
cli.on('socket', function(opt, value)
{
  defaults.socket = value;
});
cli.on('engine', function(opt, value)
{
  defaults.engine = value;
});
cli.on('help', function(opt, value)
{
  utils.log(cli.toString());
});
cli.parse(process.argv);
