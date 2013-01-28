#!/usr/bin/env bash

# @author Alejandro El Informático <aeinformatico@gmail.com>
#
# @version 0.1
#
# @description list all high CPU usage
#

TOTAL=11 # plus one because header
if [ "$1" != "" ]
then
  TOTAL=$(( $1 + 1 )) # plus one because header
fi
ps -eo pcpu,pid,user,args | sort -k 1 -r | head -$TOTAL
