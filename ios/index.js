'use strict';

var path = require('path');
var util = require('util');
var yeoman = require('yeoman-generator');
var color = require("ansi-color").set;

var sys = require('sys');
var fs = require('fs');
var exec = require('child_process').exec;

var phonegapDownloader = require('../phonegap-downloader.js');
var logger = require('../logger.js');

module.exports = Generator;

function Generator() {
  yeoman.generators.Base.apply(this, arguments);
  this.appname = path.basename(process.cwd());
  this.appname = this.appname.charAt(0).toUpperCase() + this.appname.slice(1);
}

util.inherits(Generator, yeoman.generators.Base);

Generator.prototype.askFor = function askFor() {
  var cb = this.async();

  var prompts = [{
    name: 'packageName',
    message: 'What would you like the package name to be?',
    default: 'com.awesome.package'
  }];

  this.prompt(prompts, function (err, props) {
    if (err) {
      return this.emit('error', err);
    }

    this.packageName = props.packageName;

    cb();
  }.bind(this));
};

Generator.prototype.morestuff = function morestuff() {
  var self = this;
  function success() {
    generateApp.call(self);
  }
  phonegapDownloader.download(success, logger.error);
}

var generateApp = function() {
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

  logger.info('Creating...');

  if (!fs.existsSync('./mobile')) {
    fs.mkdirSync('./mobile');
  }
  if (!fs.existsSync('./mobile/ios')) {
    fs.mkdirSync('./mobile/ios');
  }
  exec('/tmp/phonegap-2.6.0/lib/ios/bin/create mobile/ios/ ' + this.packageName + ' ' + this.appname, callback);
};