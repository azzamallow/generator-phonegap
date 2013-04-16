'use strict';
var path = require('path');
var util = require('util');
var yeoman = require('yeoman-generator');

var sys = require('sys')
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
  }, {
    name: 'phonegap',
    message: 'Where is phonegap installed?',
    default: '~/Downloads/phonegap-2.6.0'
  }];

  this.prompt(prompts, function (err, props) {
    if (err) {
      return this.emit('error', err);
    }

    this.packageName = props.packageName;
    this.phonegap = props.phonegap;

    cb();
  }.bind(this));
};

Generator.prototype.generateApp = function generateApp() {
  function puts(error, stdout, stderr) { 
    if (error) {
      sys.puts(stdout); 
    } else {
      sys.puts('Success!'); 
    }
  }

  exec(this.phonegap + '/lib/ios/bin/create ./mobile/ios/ ' + this.packageName + ' ' + this.appname, puts);
};