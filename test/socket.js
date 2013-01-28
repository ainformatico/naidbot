var net = require('net'),
    fs  = require('fs'),
    utils = require('../src/utils'),
    file = '/tmp/naidbot.sock',
    socket = new net.Socket(),
    server = net.createServer(function(sock)
    {
      console.log('Connected');
      sock.on('data', function(data)
      {
        console.log(data.toString());
      });
    }).listen(file);

server.on('close', function()
{
  console.log('Closed.');
  utils.exists(
  {
    file : file,
    success : function()
    {
      fs.unlinkSync(file);
    }
  });
});

socket.connect(file, function(a, b)
{
  socket.write('hello\n');
  socket.write('bye');
  //server.close();
});
