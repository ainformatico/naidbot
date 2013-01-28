var utils = require('../src/utils'),
    test  = [10, 12, 50, 80, 100, 120],
    res   = [12, 14, 62, 120, 144, 170];

for(var i = 0, l_test = test.length;i < l_test; i++)
{
  var current = test[i],
      octal   = utils.dec_to_oct(current),
      check   = res[i];
  (octal === check) ?
    utils.log(octal + '===' + check) :
    utils.log(octal + '!==' + check);
}
