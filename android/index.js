'use strict';
var path = require('path');
var util = require('util');
var yeoman = require('yeoman-generator');


module.exports = Generator;

function Generator() {
  yeoman.generators.Base.apply(this, arguments);
  this.argument('packageName', { type: String, required: true });
  this.appname = path.basename(process.cwd());
}

util.inherits(Generator, yeoman.generators.Base);

Generator.prototype.createFiles = function createFiles() {
  this.sourceRoot(path.join(__dirname, '../templates/android'));
  this.directory('root', '.', true);
};
