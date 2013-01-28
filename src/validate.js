var utils = require('./utils'),

    /**
     * Validate
     *
     * @author Alejandro El Informático <aeinformatico@gmail.com>
     *
     * @version 0.1
     *
     * @class validate
     *
     * */
    validate =
    {
      /**
       * validate if string is empty
      **/
      empty : function(s)
      {
        return (utils.trim(s) === '');
      }
    };

module.exports = validate;
