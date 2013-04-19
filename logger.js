
var color = require("ansi-color").set;

var prefix = 'generator-phonegap';

var Logger = {
  log: log,
  info: info,
  error: error
};

module.exports = Logger;

function log() {
  var args = [prefix].concat(Array.prototype.slice.call(arguments, 0));
  console.log.apply(this, args);
}

function info(message) {
  console.log(prefix, color(message, "green"));
}

function error(message) {
  console.log(prefix, color(message.replace(/(.*)\n/g, '$1'), "red"));
}