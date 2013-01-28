#!/usr/bin/env bash

# @author Alejandro El Informático <aeinformatico@gmail.com>
#
# @version 0.1
#
# @description install node
#

#vars
REPO=git://github.com/joyent/node.git
REPO_DESTINATION=node
REPO_VERSION=v0.8.18
NAIDBOT_BRANCH=naidbot_version
BASHRC=~/.bashrc

#functions
#print the header
header()
{
  echo -e "Setup node.js script."
  br
}

notify()
{
  ASK_SUDO_PASSWORD=
  if [ "$2" != "" ]
  then
    ASK_SUDO_PASSWORD="You may be prompted for sudo password"
  fi
  br
  echo -e "$1($ASK_SUDO_PASSWORD)"
  br
}

#print the footer
footer()
{
  echo -e "Finishing..."
  br
}

#ask and save the answer
ask()
{
  #set as secure
  PARAMS=
  if [ "$3" != "" ]
  then
    PARAMS="-s"
  fi

  echo $1
  read $PARAMS $2
  br
}

#stop the execution until key
press_to_continue()
{
  ask "Press ENTER to continue..."
}

#clear the screen
cls()
{
  clear
}

#just /br
br()
{
  echo -e "\n"
}

#do the magic
cls
header

#updating system repos
notify "Updating the system repositories." 1
sudo apt-get update --fix-missing

#install system dependencies
notify "Installing the system dependencies" 1
sudo apt-get -y install git g++ curl libssl-dev pkg-config apache2-utils libicu-dev libexpat1-dev

#get node and set version
if [ ! -d $REPO_DESTINATION ]
then
  notify "Getting the git repo..."
  git clone $REPO $REPO_DESTINATION
  cd $REPO_DESTINATION
  git checkout -b $NAIDBOT_BRANCH $REPO_VERSION
else
  notify "The repo already exists."
fi

#compile node
notify "Compiling node.js" 1
cd $REPO_DESTINATION
./configure
make
sudo make install

#set the path for node
notify "Setting the path for node..."
echo 'export NODE_PATH="/usr/local/lib/node"' >> $BASHRC
source $BASHRC

footer
press_to_continue
cls
