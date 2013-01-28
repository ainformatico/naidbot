var utils  = require('../src/utils'),
    /**
     * Naibot command parser
     *
     * @author Alejandro El Informático <aeinformatico@gmail.com>
     *
     * @version 0.1
     *
     * @class parser
     *
     * */
    parser =
    {
      /**
      * Get the command
      *
      * @param {string} the command
      *
      * @param {int} level the level to check
      *
      * @return {object} command
      *
      * @return {object} command.command the command
      *
      * @return {object} command.params the command params
      *
      * */
      get_command: function(command, commands, level)
      {
        if(level === 0) //prevent extra loops as we did not found nothing
        {
          return false;
        }
        var _this = this, //this instace
            cmd   = command.split(/\s/), //split all the command
            l_cmd = cmd.length, //cache length
            last  = {}; //where to save the data
        if(l_cmd >= level) //command or command + params?
        {
          var trigger = cmd.slice(0, level).join(' '); //get the command based on level
          if(commands.indexOf(trigger) >= 0) //is the command in the commands array?
          {
            last.command = trigger; //we found the command so we save it
            if(l_cmd > level) //got params?
            {
              last.params = cmd.slice(level, l_cmd); //save the params
            }
          }
          else //command not found, try lower level
          {
            return _this.get_command(cmd.join(' '), commands, level - 1); //try lower level
          }
        }
        else //is not in the command trigger length, try lower levels
        {
          last = _this.get_command(cmd.join(' '), commands, level - 1); //try to find a command with less triggers
        }
        return last; //return the command
      },
      /**
       * Parse options
       *
       * @param {string} data the data
       *
       * @return {object} the options
       *
      **/
      get_opts : function(data)
      {
        var obj = {},
            i,
            tmp = "",
            flag = ' ',
            inside = false,
            current = "",
            value,
            l_data = data.length;

        for (i = 0; i < l_data; i++) {
          value = data[i];
          if (i == 0)
          {
            obj[data[0]]="";
            current = data[0];
            i+=1;
            continue;
          }
          if (value == '"')
          {
            tmp += value;
            if (inside)
            {
              flag = ' ';
              inside = false;
            }
            else
            {
              flag = '"';
              inside = true;
              continue;
            }
          }
          if ((value != flag) || (value == flag && data[i+2] != ':'))
          {
            tmp += value;
          }
          if (
              (value == flag && data[i+2] == ':') ||
              (i == l_data-1))
          {
            if (tmp.indexOf('"') != -1)
            {
              obj[current] = tmp.replace(/"/g,'');
            }
            else
            {
              if (tmp.indexOf(',') !== -1)
              {
                obj[current] = tmp.split(',');
              }
              else
              {
                obj[current] = tmp;
              }
            }
            if (i < l_data-1)
            {
              obj[data[i+1]]="";
              tmp = "";
              current = data[i+1];
              i += 2;
            }
          }
        }
        return obj;
      }
    };

module.exports = parser;
