'use strict';
var path = require('path');
var util = require('util');
var spawn = require('child_process').spawn;
var yeoman = require('yeoman-generator');


var Generator = module.exports = function Generator() {
  yeoman.generators.Base.apply(this, arguments);
  this.argument('appname', { type: String, required: false });
  this.appname = this.appname || path.basename(process.cwd());

  var args = ['main'];

  if (typeof this.env.options.appPath === 'undefined') {
    try {
      this.env.options.appPath = require(path.join(process.cwd(), 'component.json')).appPath;
    } catch (e) {}
    this.env.options.appPath = this.env.options.appPath || 'app';
  }

  this.appPath = this.env.options.appPath;

  this.hookFor('angular:app', {
    args: '--coffee'
  });

  this.on('end', function () {
    this.installDependencies({ skipInstall: this.options['skip-install'] });
  });
};

util.inherits(Generator, yeoman.generators.NamedBase);

Generator.prototype.packageFiles = function () {
  this.template('../../templates/common/component.json', 'component.json');
  this.template('../../templates/common/package.json', 'package.json');
  this.template('../../templates/common/Gruntfile.js', 'Gruntfile.js');
};
