'use strict';
var path = require('path');
var util = require('util');
var yeoman = require('yeoman-generator');
var downloader = require('downloader');
var AdmZip = require('adm-zip');

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

  var unzip = function () {
    if (fs.existsSync("/tmp/phonegap-2.6.0/")) {
      console.log('already extracted');
      return;
    }
    var zip = new AdmZip("/tmp/phonegap-2.6.0.zip");
    zip.extractAllTo("/tmp", true);
    fs.chmodSync('/tmp/phonegap-2.6.0/lib/ios/bin/create', '0766');
    fs.chmodSync('/tmp/phonegap-2.6.0/lib/ios/bin/replaces', '0766');
    fs.chmodSync('/tmp/phonegap-2.6.0/lib/ios/bin/update_cordova_subprojec', '0766');
  };

  var downloadDir = '/tmp/';

  downloader.on('done', function(msg) {
    console.log('generator-phonegap extracting phonegap...');
    unzip();
  });

  downloader.on('error', function(msg) {
    console.log(msg);
  });

  if (fs.existsSync("/tmp/phonegap-2.6.0.zip")) {
    console.log('already downloaded');
    unzip();
    return;
  }

  console.log('generator-phonegap http GET https://s3.amazonaws.com/phonegap.download/phonegap-2.6.0.zip');
  downloader.download("https://s3.amazonaws.com/phonegap.download/phonegap-2.6.0.zip", downloadDir);
};

Generator.prototype.generateApp = function generateApp() {
  function puts(error, stdout, stderr) { 
    if (error) {
      sys.puts(stdout); 
      sys.puts(stderr); 
      sys.puts(error); 
    } else {
      sys.puts('Success!'); 
    }
  }

  console.log('creating phonegap app');
  if (!fs.existsSync('./mobile')) {
    fs.mkdirSync('./mobile');
  }
  if (!fs.existsSync('./mobile/ios')) {
    fs.mkdirSync('./mobile/ios');
  }
  exec('/tmp/phonegap-2.6.0/lib/ios/bin/create ./mobile/ios/ ' + this.packageName + ' ' + this.appname, puts);
};