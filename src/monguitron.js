var mongodb = require('mongodb'),
    utils = require('./utils'),
    parser = require('./parser'),
/**
 * Monguitron
 *
 * @author Pau Gallardo <pau.portalp@gmail.com>
 *
 * @version 0.1
 *
 * @class monguitron
 *
 * */

monguitron =
{
  /**
   * Server Info
  **/
  host : '127.0.0.1',
  port : 27017,
  options : {},
  dataBase : 'naidbot',
  /**
   * Server conexion
   *
   * @private
   *
   * @return object with server conexion
   *
  **/
  _server : function()
  {
    return new mongodb.Server(this.host, this.port, this.options);
  },
  /**
   * Triggers of groups or user
   *
   * @private
   *
   * @param {object}   data the data
   *
   * @param {array}    data.match array of objects to match
   *
   * @param {int}      data.num_triggers number of triggers
   *
   * @param {function} data.success success callback
   *
  **/
  _triggers : function(data)
  {
    new mongodb.Db(this.dataBase, this._server(), {}).open(function (error, client)
    {
      if (error) throw error;
      var tabla = new mongodb.Collection(client, 'triggers'),
          obj;
      if (typeof data.num_triggers === 'undefined')
      {
          obj = {$or : data.match};
      }
      else
      {
          obj = {$or : data.match, num : { '$lte' : data.num_triggers}};
      };

      tabla.find(
        obj,
        {}
      ).toArray(function(error,docs)
      {
        (error !== null) && utils.debug(error);
        if(typeof data.success === 'function')
        {
          (docs) ? data.success(docs) : data.success(false);
        }
      });
    });
  },
  /**
   * _find query
   *
   * @private
   *
   * @param {object}   data the data
   *
   * @param {string}   data.coll collection
   *
   * @param {object}   data.query the query
   *
   * @param {object}   data.return camps to show
   *
   * @param {function} data.success success callback
   *
  **/
  _find : function(data)
  {
    new mongodb.Db(this.dataBase, this._server(), {}).open(function (error, client)
    {
      if (error) throw error;
      var tabla = new mongodb.Collection(client, data.coll);
      tabla.find(
        data.query,
        data.return
      ).toArray(function(error,docs)
      {
        (error !== null) && utils.debug(error);
        (typeof data.success === 'function') && data.success(docs);
      });
    });
  },
  /**
   * _remove query
   *
   * @private
   *
   * @param {object}   data the data
   *
   * @param {string}   data.coll collection
   *
   * @param {object}   data.match match to remove
   *
   * @param {function} data.success success callback
   *
  **/
  _remove : function(data)
  {
    new mongodb.Db(this.dataBase, this._server(), {}).open(function (error, client)
      {
      if (error) throw error;
      var tabla = new mongodb.Collection(client, data.coll);
      tabla.remove(
        data.match,
        {safe : true},
        function(error,docs)
        {
          (error !== null) && utils.debug(error);
          (typeof data.success === 'function') && data.success(docs);
        }
      )
    });
  },
  /**
   * _insert object
   *
   * @private
   *
   * @param {object}   data the data
   *
   * @param {string}   data.coll collection
   *
   * @param {object}   data.opt insert options safe
   *
   * @param {object}   data.object the object
   *
   * @param {function} data.success success callback
   *
  **/
  _insert : function(data)
  {
    new mongodb.Db(this.dataBase, this._server(), {}).open(function (error, client)
      {
      if (error) throw error;
      var tabla = new mongodb.Collection(client, data.coll);
      tabla.insert(
        data.object,
        data.opt,
        function(error,docs)
        {
          (error !== null) && utils.debug(error);
          (typeof data.success === 'function') && data.success(docs);
        }
      )
    });
  },
  /**
   * _update
   *
   * @private
   *
   * @param {object}   data the data
   *
   * @param {string}   data.coll collection
   *
   * @param {object}   data.match object to match
   *
   * @param {object}   data.set object query to set
   *
   * @param {boolean}  data.multi update multiples objects
   *
   * @param {function} data.success success callback
   *
  **/
  _update : function(data)
  {
    new mongodb.Db(this.dataBase, this._server(), {}).open(function (error, client)
    {
      if (error) throw error;
      var opt = {safe : true, upsert : true};
      if (data.multi)
      {
        opt = {
          multi : true,
          safe : true,
          upsert : true
        }
      }
      var tabla = new mongodb.Collection(client, data.coll);
      tabla.update(
        data.match,
        data.set,
        opt,
        function(error,docs)
        {
          (error !== null) && utils.error(error);
          (typeof data.success === 'function') && data.success(docs);
        }
      );
    });
  },
   /**
   * add or remove value into array of collection
   *
   * @private
   *
   * @param {object}   data the data
   *
   * @param {string}   data.coll collention
   *
   * @param {object}   data.match the match
   *
   * @param {string}   data.field the field
   *
   * @param {string}   data.value the value
   *
   * @param {boolean}  data.remove remove value?
   *
   * @param {function} data.success success callback
   *
  **/
  _mod_value_array : function(data)
  {
    var _set,
        _field = {};
    _field[data.field] = data.value;
    _set = (data.remove) ?
      {$pull : _field} :
      {$push : _field};
    this._update(
    {
      coll : data.coll,
      match : data.match,
      set : _set,
      multi : false,
      success : function(data_insert)
      {
        (typeof data.success === 'function') && data.success(data_insert);
      }
    });
  },
  /**
   * add user
   *
   * @param {object}   data the data
   *
   * @param {string}   data.user user name
   *
   * @param {array}    data.groups groups of user
   *
   * @param {function} data.success success callback
   *
  **/
  add_user : function(data)
  {
    this._insert(
    {
      coll : 'users',
      object :
      {
        name : data.user,
        groups : data.groups
      },
      opt : {safe:true},
      success : function(docs)
      {
        (typeof data.success === 'function') && data.success(true);
      }
    });
  },
  /**
   * remove user
   *
   * @param {object}   data the data
   *
   * @param {string}   data.user user name
   *
   * @param {function} data.success success callback
   *
  **/
  remove_user : function(data)
  {
    var _this = this;
    this._remove(
    {
      coll : 'users',
      match :
      {
        name : data.user,
      },
      success : function(data_remove_usr)
      {
        _this._mod_value_array({
          coll : 'triggers',
          match : {user : data.user},
          field : 'user',
          value : data.user,
          remove : true,
          success : function(data_remove_trg)
          {
            if(typeof data.success === 'function')
            {
              (data_remove_usr && data_remove_usr > 0) ?
                data.success(true) :
                data.success(false);
            }
          }
        });
      }
    });
  },
  /**
   * add group to user
   *
   * @param {object}   data the data
   *
   * @param {string}   data.user user name
   *
   * @param {string}   data.group group of user
   *
   * @param {function} data.success success callback
   *
  **/
  add_group_user : function(data)
  {
    this._mod_value_array(
    {
      coll : 'users',
      match : {name : data.user},
      field : 'groups',
      value : data.group,
      remove : false,
      success : function(data_find)
      {
        (typeof data.success === 'function') && data.success(data_find);
      }
    });
  },
  /**
   * remove group of user
   *
   * @param {object}   data the data
   *
   * @param {string}   data.user user name
   *
   * @param {string}   data.group group of user
   *
   * @param {function} data.success success callback
   *
  **/
  remove_group_user : function(data)
  {
    this._mod_value_array(
    {
      coll : 'users',
      match : {name : data.user},
      field : 'groups',
      value : data.group,
      remove : true,
      success : function(data_find)
      {
        (typeof data.success === 'function') && data.success(data_find);
      }
    });
  },
  /**
   * add trigger
   *
   * @param {object}   data the data
   *
   * @param {string}   data.trigger the trigger
   *
   * @param {array}    data.users users with privileges
   *
   * @param {array}    data.groups groups with privileges
   *
   * @param {string}   data.script path to script
   *
   * @param {string}   data.description description of trigger
   *
   * @param {function} data.success success callback
   *
  **/
  add_trigger : function(data)
  {
    var obj = {};
    obj.name = data.trigger;
    obj.num = data.trigger.split(' ').length;
    obj.user = (typeof data.users === 'object') ? data.users : data.users.split(' ');
    obj.group = (typeof data.groups === 'object') ? data.groups : data.groups.split(' ');
    obj.script = data.script;
    obj.description = data.description;
    this._insert(
    {
      coll : 'triggers',
      object : obj,
      opt : {safe:true},
      success : function(data_insert)
      {
        (typeof data.success === 'function') && data.success(data_insert);
      }
    });
  },
  /**
   * remove trigger
   *
   * @param {object}   data the data
   *
   * @param {string}   data.trigger trigger name
   *
   * @param {function} success success callback
   *
  **/
  remove_trigger : function(data)
  {
    this._remove({
      coll : 'triggers',
      match :
      {
        name : data.trigger
      },
      success : function(removed)
      {
        if(typeof data.success === 'function')
        {
          (removed && removed > 0) ?
            data.success(true) :
            data.success(false);
        }
      }
    });
  },
  /**
   * add user to trigger
   *
   * @param {object}   data the data
   *
   * @param {string}   data.trigger trigger name
   *
   * @param {string}   data.user user of trigger
   *
   * @param {function} data.success success callback
   *
  **/
  add_user_trigger : function(data)
  {
    this._mod_value_array(
    {
      coll : 'triggers',
      match : {name : data.trigger},
      field : 'user',
      value : data.user,
      remove : false,
      success : function(data_find)
      {
        (typeof data.success === 'function') && data.success(true);
      }
    });
  },
  /**
   * remove user of trigger
   *
   * @param {object}   data the data
   *
   * @param {string}   data.trigger trigger name
   *
   * @param {string}   data.user user of trigger
   *
   * @param {function} data.success success callback
   *
  **/
  remove_user_trigger : function(data)
  {
    this._mod_value_array(
    {
      coll : 'triggers',
      match : {name : data.trigger},
      field : 'user',
      value : data.user,
      remove : true,
      success : function(data_find)
      {
        (typeof data.success === 'function') && data.success(true);
      }
    });
  },
  /**
   * add group to trigger
   *
   * @param {object}   data the data
   *
   * @param {string}   data.trigger trigger name
   *
   * @param {string}   data.group group of trigger
   *
   * @param {function} data.success success callback
   *
  **/
  add_group_trigger : function(data)
  {
    this._mod_value_array(
    {
      coll : 'triggers',
      match : {name : data.trigger},
      field : 'group',
      value : data.group,
      remove : false,
      success : function(data_find)
      {
        (typeof data.success === 'function') && data.success(true);
      }
    });
  },
  /**
   * remove group of trigger
   *
   * @param {object}   data the data
   *
   * @param {string}   data.trigger trigger name
   *
   * @param {string}   data.group group of trigger
   *
   * @param {function} data.success success callback
   *
  **/
  remove_group_trigger : function(data)
  {
    this._mod_value_array(
    {
      coll : 'triggers',
      match : {name : data.trigger},
      field : 'group',
      value : data.group,
      remove : true,
      success : function(data_find)
      {
        (typeof data.success === 'function') && data.success(true);
      }
    });
  },
  /**
   * modify description of trigger
   *
   * @param {object}   data the data
   *
   * @param {string}   data.trigger trigger name
   *
   * @param {string}   data.description new description
   *
   * @param {function} data.success success callback
   *
  **/
  mod_description_trigger : function(data)
  {
    this._update(
    {
      coll : 'triggers',
      match : {
        name : data.trigger
      },
      set :
      {
        $set : {description : data.description}
      },
      multi : false,
      success : function(updated)
      {
        if(typeof data.success === 'function')
        {
          (updated > 0) ?
            data.success(true) :
            data.success(false);
        }
      }
    });
  },
  /**
   * modify script of trigger
   *
   * @param {object}   data the data
   *
   * @param {string}   data.trigger trigger name
   *
   * @param {string}   data.script new script
   *
   * @param {function} data.success success callback
   *
  **/
  mod_script_trigger : function(data)
  {
    this._update(
    {
      coll : 'triggers',
      match : {
        name : data.trigger
      },
      set :
      {
        $set : {script : data.script}
      },
      multi : false,
      success : function(updated)
      {
        if(typeof data.success === 'function')
        {
          (updated > 0) ?
            data.success(true) :
            data.success(false);
        }
      }
    });
  },
  /**
   * add group
   *
   * @param {object}   data the data
   *
   * @param {string}   data.group group name
   *
   * @param {function} data.success success callback
   *
  **/
  add_group : function(data)
  {
    this._mod_value_array(
    {
      coll : 'groups',
      match : {},
      field : 'name',
      value : data.group,
      remove : false,
      success : function(data_find)
      {
        (typeof data.success === 'function') && data.success(true);
      }
    });
  },
  /**
   * remove group
   *
   * @param {object}   data the data
   *
   * @param {string}   data.group group name
   *
   * @param {function} data.success success callback
   *
  **/
  remove_group : function(data)
  {
    this._mod_value_array(
    {
      coll : 'groups',
      match : {},
      field : 'name',
      value : data.group,
      remove : true,
      success : function(data_find)
      {
        //TODO implement remove group of triggers
        (typeof data.success === 'function') && data.success(true);
      }
    });
  },
  /**
   * All groups
   *
   * @param {object} data the data
   *
   * @param {function} data.success success callback
  **/
  all_groups : function(data)
  {
    this._find({
      coll : 'groups',
      query : {},
      return : {name : 1, _id : 0},
      success : function(docs)
      {
        (typeof data.success === 'function') && data.success(docs[0].name);
      }
    });
  },
  /**
   * All groups
   *
   * @param {object} data the data
   *
   * @param {function} data.success success callback
  **/
  all_users : function(data)
  {
    this._find({
      coll : 'users',
      query : {},
      return : {name : 1, _id : 0},
      success : function(docs)
      {
        (typeof data.success === 'function' && docs)
        {
          var i,
              l_triggers = docs.length,
              finale = [];
          for (i = 0; i < l_triggers; i++)
          {
            finale.push(docs[i].name);
          }
         data.success(finale)
       }
      }
    });
  },
  /**
   * Groups of user
   *
   * @param {object}   data the data
   *
   * @param {string}   data.user user name
   *
   * @param {function} data.success success callback
   *
  **/
  user_groups : function(data)
  {
    this._find(
    {
      coll : 'users',
      query : {name : data.user},
      return : {groups : 1},
      success : function(data_grp)
      {
        if(typeof data.success === 'function')
        {
          (data_grp && data_grp.length > 0) ?
            data.success(data_grp[0].groups) :
            data.success(false);
        }
      }
    });
  },
  /**
   * Script of trigger
   *
   * @param {object}   data the data
   *
   * @param {string}   data.trigger the trigger
   *
   * @param {function} data.success success callback
   *
  **/
  script : function(data)
  {
    this._find(
    {
      coll : 'triggers',
      query : {name : data.trigger},
      return : {script : 1},
      success : function(docs)
      {
        if(typeof data.success === 'function')
        {
          (docs && docs.length > 0) ?
            data.success(docs[0].script) : //return the data
            data.success(false); //no data found
        }
      }
    });
  },
  /**
   * Triggers of group or user
   * Set only data.user or data.group
   *
   * @param {object}   data the data
   *
   * @param {string}   data.user user name
   *
   * @param {string}   data.group group name
   *
   * @param {function} data.success success callback
   *
  **/
  all_member_triggers : function(data)
  {
    var find;
    if (typeof data.user === 'string')
    {
      //find = {user:data.user};
      var _this = this,
      grps = [];
      this.user_groups(
      {
        user : data.user,
        success : function(success_grps)
        {
          var l_groups = success_grps.length,
              groups = [];
          for (var i = 0; i < l_groups; i++)
          {
            groups.push({group : success_grps[i]});
          }
          groups.push({user : data.user});
          _this._triggers(
          {
            match : groups,
            success:function(docs)
            {
              if(typeof data.success === 'function')
              {
                if (docs && docs.length > 0)
                {
                  if(!data.all)
                  {
                    var i,
                        l_triggers = docs.length,
                        finale = [];
                    for (i = 0; i < l_triggers; i++)
                    {
                      finale.push(docs[i].name);
                    }
                    data.success(finale);
                  }
                  else
                  {
                    data.success(docs);
                  }
                }
                else
                {
                  data.success(false);
                }
              }
            }
          });
        }
      });
    }
    else
    {
      find = {group:data.group}
      this._find(
      {
        coll : 'triggers',
        query : find,
        return : {name : 1},
        success : function(docs)
        {
          if(typeof data.success === 'function')
          {
            if (docs && docs.length > 0)
            {
              var res = [],
                  l_docs = docs.length,
                  i;
              for (i = 0; i < l_docs; i++) {
                res.push(docs[i].name);
              }
              data.success(res);
            }
            else
            {
              data.success(false);
            }
          }
        }
      });
    }
  },
  /**
   * User triggers with num_triggers
   *
   * @param {object}   data the data
   *
   * @param {string}   data.user user name
   *
   * @param {int}      data.num_triggers number of triggers
   *
   * @param {function} data.success success callback
   *
  **/
  triggers : function(data)
  {
    var _this = this,
        grps = [];
    this.user_groups(
    {
      user : data.user,
      success : function(success_grps)
      {
        var l_groups = success_grps.length,
            groups = [];
        for (var i = 0; i < l_groups; i++)
        {
          groups.push({group : success_grps[i]});
        }
        groups.push({user : data.user});
        _this._triggers(
        {
          match : groups,
          num_triggers : data.num_triggers,
          success:function(success_grps_trig)
          {
            if (success_grps_trig === false)
            {
              data.success(false)
            }
            else
            {
              var i,
                  l_triggers = success_grps_trig.length,
                  finale = [];
              for (i = 0; i < l_triggers; i++)
              {
                finale.push(success_grps_trig[i].name);
              }
              data.success(finale); //return the data
            }
          }
        });
      }
    }
    );
  },
  /**
   * all users of gruop or groups
   *
   * @param {object} data
   *
   * @param {object} data.groups
   *
   * @param {function} data.success success callback
   *
  **/
  users_group : function(data)
  {
    var query;
    if(typeof data.groups === 'string')
    {
      query = {groups : data.groups};
    }
    else if(typeof data.groups === 'object')
    {
      var grps = [],
          l_grp = data.groups.length,
          a;
      for (a = 0; a < l_grp; a++) {
        grps.push({groups : data.groups[a]});
      }
      query = {$or : grps};
    }
    else
    {
      query = {};
    }
    this._find(
    {
      coll : 'users',
      query : query,
      return : {name : 1},
      success : function(docs)
      {
        if (docs && docs.length > 0)
        {
          var res = [],
              l_docs = docs.length,
              i;
          for (i = 0; i < l_docs; i++) {
            res.push(docs[i].name);
          }
          data.success(res);
        }
        else
        {
          data.success(false);
        }
      }
    });

  },
  /**
   * All info of trigger
   *
   * @param {object}   data the data
   *
   * @param {string}   data.trigger trigger name
   *
   * @param {function} data.success success callback
   *
  **/
  info_trigger : function(data)
  {
    this._find(
    {
      coll : 'triggers',
      query : {name : data.trigger},
      return : {_id : 0},
      success : function(docs)
      {
        (typeof data.success === 'function') && data.success(docs[0]);
      }
    });
  }
};

module.exports = monguitron;
