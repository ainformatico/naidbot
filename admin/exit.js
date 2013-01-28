var command =
    {
      trigger     : 'exit',
      description : 'Close the session',
      action      : function(opts)
      {
        this._exit();
      }
    };
module.exports = command;
