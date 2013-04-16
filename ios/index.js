'use strict';
var path = require('path');
var util = require('util');
var yeoman = require('yeoman-generator');


module.exports = Generator;

function Generator() {
  yeoman.generators.Base.apply(this, arguments);
}

util.inherits(Generator, yeoman.generators.Base);

Generator.prototype.createFiles = function createFiles() {
  this.sourceRoot(path.join(__dirname, '../templates/ios'));
  this.directory('root', '.', true);
};
