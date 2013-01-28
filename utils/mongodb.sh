#!/usr/bin/env bash

# @author Alejandro El Informático <aeinformatico@gmail.com>
#
# @version 0.1
#
# @description install mongodb
#

#vars
APT_SOURCES=/etc/apt/sources.list

npm install

#check if the source exists
cat /etc/apt/sources.list | grep 10gen > /dev/null
if [[ $? -eq 1 ]]
then
  sudo sh -c "echo deb 'http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen' >> /etc/apt/sources.list"
fi

sudo apt-get update --fix-missing
sudo apt-get install -y --force-yes mongodb-10gen
