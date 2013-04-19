'use strict';

var fs = require('fs');
var AdmZip = require('adm-zip');
var downloader = require('downloader');

var downloadDir = '/tmp/';
var phonegap = 'phonegap-2.6.0';

module.exports = {
  download: download
};

function download(success, error) {
  fetch(function () {
    unzip(function () {
      success();
    }, error);
  }, error);
}

function fetch(success, error) {
  if (fs.existsSync(downloadDir + phonegap + '.zip')) {
    success();
    return;
  }

  downloader.on('done', success);
  downloader.on('error', error);
  downloader.download('https://s3.amazonaws.com/phonegap.download/' + phonegap + '.zip', downloadDir);
}

function unzip(success, error) {
  if (fs.existsSync(downloadDir + phonegap)) {
    success();
    return;
  }

  var zip = new AdmZip(downloadDir + phonegap + '.zip');
  zip.extractAllTo(downloadDir, true);
  fs.chmodSync(downloadDir + phonegap + '/lib/ios/bin/create', '0766');
  fs.chmodSync(downloadDir + phonegap + '/lib/ios/bin/replaces', '0766');
  fs.chmodSync(downloadDir + phonegap + '/lib/ios/bin/update_cordova_subproject', '0766');

  success();
}