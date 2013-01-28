naidbot
==============
* *N*ode
* M*aid*
* *bot*

Unix assistant XMPP bot.

Install
-------------
###Automatic
1. run `./install.sh` and follow the instructions.
  * if you use the `-a` argument the installer will install node as well.
2. no step two :D

####NOTE
Please first check the installer actions as you may disagree with some configurations.

###Manual

* download and compile _node.js_.
  * you can use your OS package manager but you can get an older and buggy version of _node.js_.
* install _mongoDB_.
* import the base _DB_.
* run `npm install` to install naidbot dependencies.
* create the config file, you can use the template file at `template/`:

    var config =
    {
        username   : 'your@gmail.com',
        password   : 'yourpassword',
        main_admin : 'main@admin.com'
    };
    module.exports = config;

Usage
------

    $ node bin/naidbot.js

Usage help:

    $ node bin/naidbot.js -h

Authors
----------
* Alejandro El Informático

Contributors
--------------
* Pau Gallardo Perez

License
---------
naidbot is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

naidbot is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with naidbot. If not, see http://www.gnu.org/licenses/.
