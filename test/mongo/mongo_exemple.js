var mon = require('./monguitron');

mon.script(
{
  user : 'carles',
  trigger : 'service start',
  num_triggers : 2,
  success : function(data)
  {
    console.log(data);
  }
}
);
