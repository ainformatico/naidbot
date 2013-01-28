#!/bin/bash

mongoimport --drop -d naidbot -c groups groups.json
mongoimport --drop -d naidbot -c triggers triggers.json
mongoimport --drop -d naidbot -c users users.json
