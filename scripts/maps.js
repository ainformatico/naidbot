#!/usr/local/bin/node

/**
 * @author Pau Gallardo <pau.portalp@gmail.com>
 *
 * @version 0.1
 *
 * @description mapa de google maps
 *
 * */

var location = process.argv.slice(2).join('+');

console.log("Google - https://maps.google.es/maps?q="+location);
console.log("Yahoo - http://maps.yahoo.com/#tt=&q="+location);

