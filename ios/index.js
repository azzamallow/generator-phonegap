'use strict';

var path = require('path');
var util = require('util');
var yeoman = require('yeoman-generator');
var phonegapDownloader = require('../phonegap-downloader.js');
var phonegapCreator = require('../phonegap-creator.js');
var logger = require('../logger.js');

module.exports = Generator;

function Generator() {
  yeoman.generators.Base.apply(this, arguments);
  this.appName = path.basename(process.cwd());
  this.appName = this.appName.charAt(0).toUpperCase() + this.appName.slice(1);
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

Generator.prototype.crunch = function crunch() {
  var packageName = this.packageName, appName = this.appName;
  phonegapDownloader.download(function () {
    phonegapCreator.create('ios', packageName, appName);
  });
};