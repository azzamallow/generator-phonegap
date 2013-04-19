'use strict';

var fs = require('fs');
var AdmZip = require('adm-zip');
var downloader = require('downloader');
var logger = require('./logger.js');
var color = require("ansi-color").set;

var downloadDir = '/tmp/';
var phonegap = 'phonegap-2.6.0';
var zipFile = phonegap + '.zip';
var url = 'https://s3.amazonaws.com/phonegap.download/' + zipFile;

module.exports = {
  download: download
};

function download(success, error) {
  logger.log(color("http", "green"), color("GET", "magenta"), url);

  fetch(function () {
    unzip(function () {
      success();
    }, error);
  }, error);
}

function fetch(success, error) {
  if (fs.existsSync(zipFile)) {
    success();
    return;
  }

  downloader.on('done', success);
  downloader.on('error', error);
  downloader.download(url, downloadDir);
}

function unzip(success, error) {
  if (fs.existsSync(downloadDir + phonegap)) {
    success();
    return;
  }

  var zip = new AdmZip(downloadDir + zipFile);
  zip.extractAllTo(downloadDir, true);
  fs.chmodSync(downloadDir + phonegap + '/lib/ios/bin/create', '0766');
  fs.chmodSync(downloadDir + phonegap + '/lib/ios/bin/replaces', '0766');
  fs.chmodSync(downloadDir + phonegap + '/lib/ios/bin/update_cordova_subproject', '0766');

  success();
}