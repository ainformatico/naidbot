var utils  = require('../src/utils'),
    exec   = require('child_process').exec,
    i18n   = require('../i18n/en'),
    /**
     * Run the scripts
     *
     * @author Alejandro El Informático <aeinformatico@gmail.com>
     *
     * @version 0.1
     *
     * @class scripts
     *
     * */
    script =
    {
      /**
       * run commands
       *
       *
      **/
      run: function(opts)
      {
        utils.exists(
        {
          file : opts.command,
          exec : true,
          /**
           *
          **/
          success : function()
          {
            var params = (opts.params) ? opts.params.join(' ') : '';
            params = params.replace(/<.*>/, ''); //prevent client URL parser: "www.example.com <www.example.com>"
            if(!params.match(/`|\$|\||(<|>)|\||;/g))
            {
              exec(opts.command + ' ' + params, function(error, stdout, stderr)
              {
                if(error === null)
                {
                  (typeof opts.success === 'function') && opts.success(stdout);
                }
                else
                {
                  (typeof opts.script_error === 'function') && opts.script_error(stderr);
                }
              });
            }
            else
            {
              (typeof opts.script_error === 'function') && opts.script_error(false);
            }
          },
          /**
           * @private
          **/
          no_exec : function()
          {
            (typeof opts.no_exec === 'function') && opts.no_exec(opts.command);
          },
          /**
           * @private
          **/
          error : function(code)
          {
            if(code === 'ENOENT')
            {
              (typeof opts.error === 'function') && opts.error(i18n.error.file.not_exists);
            }
          }
        });
      }
    };

module.exports = script;
