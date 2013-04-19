'use strict';

var fs = require('fs');
var exec = require('child_process').exec;
var logger = require('./logger.js');

module.exports = {
  create: create
};

function create(platform, packageName, appName) {
  logger.info('Creating...');

  if (!fs.existsSync('./mobile')) {
    fs.mkdirSync('./mobile');
  }
  if (!fs.existsSync('./mobile/' + platform)) {
    fs.mkdirSync('./mobile/' + platform);
  }
  exec('/tmp/phonegap-2.6.0/lib/' + platform + '/bin/create mobile/' + platform + '/ ' + packageName + ' ' + appName, callback);
}

function callback(error, stdout, stderr) {
  if (error) {
    if (stdout !== undefined && stdout !== null && stdout !== '') {
      logger.error(stdout);
    }

    if (stderr !== undefined && stderr !== null && stderr !== '') {
      logger.error(stderr);
    }
  } else {
    logger.info('Done!');
  }
}