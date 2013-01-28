#!/usr/bin/env bash

# @author Alejandro El Informático <aeinformatico@gmail.com>
#
# @version 0.1
#
# @description print the apache log
#

TOTAL=5
DIR="/var/log/apache2"
FILE="error.log"

if [ "$1" != "" ]
then
  TOTAL=$1
fi

if [ "$2" == "access" ]
then
  FILE="access.log"
fi

tail -n $TOTAL "$DIR/$FILE"
