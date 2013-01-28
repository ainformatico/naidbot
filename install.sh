#!/usr/bin/env bash

# @author Alejandro El Informático <aeinformatico@gmail.com>
#
# @version 0.1
#
# @description install naidbot
#

#vars
USERNAME=
MAIN_ADMIN=
TEMPLATE=template
CONFIG_TEMPLATE=config.js
CONFIG_DESTINATION=_config.js
INSTALL_MONGODB=0
INSTALL_NODE=0

#colors
C_RESET='\e[0;37m'
C_RED='\e[0;31m'

#parse options
for i in $*
do
  case $i in
    -a) # install all
      INSTALL_NODE=1
      INSTALL_MONGODB=1
    ;;
    -m) # install mongodb
      INSTALL_MONGODB=1
    ;;
    -n) # install node
      INSTALL_NODE=1
    ;;
  esac
done

#functions
#print the header
header()
{
  echo -e "Naidbot installation script."
  br
}

#print warning to check the final warning
check_info()
{
  echo -e "${C_RED}IMPORTANT: don't forget to check all the info stored in '$1'${C_RESET}"
  br
}

#print the footer
footer()
{
  echo -e "Finishing..."
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

#replace string in file
replace()
{
  sed -i "s/$1/$2/" $3
}

#set the basic information, do the magic
cls
header
br

if [[ $INSTALL_NODE -eq 1 ]] #install all
then
  ./utils/node.sh
  br
fi

if [[ $INSTALL_MONGODB -eq 1 ]] #install mongodb
then
  ./utils/mongodb.sh
  br
fi

./utils/naidbot_db.sh

br
cp "$TEMPLATE/$CONFIG_TEMPLATE" $CONFIG_DESTINATION
ask "Please insert the username(email):" USERNAME
ask "Please insert the password" PASSWORD 1
ask "Please insert the main administrator(email) for Naidbot:" MAIN_ADMIN
replace "{user}" $USERNAME $CONFIG_DESTINATION
replace "{password}" "$PASSWORD" $CONFIG_DESTINATION
replace "{admin}" $MAIN_ADMIN $CONFIG_DESTINATION
footer
check_info $CONFIG_DESTINATION
press_to_continue
