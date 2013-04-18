'use strict';
var path = require('path');
var util = require('util');
var yeoman = require('yeoman-generator');
var downloader = require('downloader');
var AdmZip = require('adm-zip');
var color = require("ansi-color").set;

var sys = require('sys')
var fs = require('fs')
var exec = require('child_process').exec;

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

Generator.prototype.downloadPhonegap = function downloadPhonegap() {
  var self = this;
  var unzip = function () {
    if (fs.existsSync("/tmp/phonegap-2.6.0/")) {
      generateApp.call(self);
      return;
    }

    console.log('generator-phonegap', color("Extracting...", "green"));
    var zip = new AdmZip("/tmp/phonegap-2.6.0.zip");
    zip.extractAllTo("/tmp", true);
    fs.chmodSync('/tmp/phonegap-2.6.0/lib/ios/bin/create', '0766');
    fs.chmodSync('/tmp/phonegap-2.6.0/lib/ios/bin/replaces', '0766');
    fs.chmodSync('/tmp/phonegap-2.6.0/lib/ios/bin/update_cordova_subproject', '0766');
    generateApp.call(self);
  };

  var downloadDir = '/tmp/';

  downloader.on('done', function(msg) {
    unzip();
  });

  downloader.on('error', function(msg) {
    console.log('generator-phonegap', color(msg.replace(/(.*)\n/g, '$1'), "red"));
  });

  if (fs.existsSync("/tmp/phonegap-2.6.0.zip")) {
    unzip();
    return;
  }

  console.log('generator-phonegap', color("http", "green"), color("GET", "magenta"), "https://s3.amazonaws.com/phonegap.download/phonegap-2.6.0.zip");
  downloader.download("https://s3.amazonaws.com/phonegap.download/phonegap-2.6.0.zip", downloadDir);
};

var generateApp = function() {
  function callback(error, stdout, stderr) { 
    if (error) {
      if (stdout !== undefined && stdout !== null && stdout !== '') {
        console.log('generator-phonegap', color(stdout.replace(/(.*)\n/g, '$1'), "red"));
      }

      if (stderr !== undefined && stderr !== null && stderr !== '') {
        console.log('generator-phonegap', color(stderr.replace(/(.*)\n/g, '$1'), "red"));
      }
    } else {
      console.log('generator-phonegap', color("Done!", "green"));
    }
  }

  console.log('generator-phonegap', color("Creating...", "green"));
  if (!fs.existsSync('./mobile')) {
    fs.mkdirSync('./mobile');
  }
  if (!fs.existsSync('./mobile/ios')) {
    fs.mkdirSync('./mobile/ios');
  }
  exec('/tmp/phonegap-2.6.0/lib/ios/bin/create mobile/ios/ ' + this.packageName + ' ' + this.appname, callback);
};