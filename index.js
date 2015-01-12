'use strict';

exports.getOs = function () {
  return /^win/.test (process.platform) ? 'win' : process.platform;
};

exports.getExecExt = function () {
  return /^win/.test (process.platform) ? '.exe' : '';
};

exports.getShellExt = function () {
  return /^win/.test (process.platform) ? '.bat' : '';
};

exports.getCmdExt = function () {
  return /^win/.test (process.platform) ? '.cmd' : '';
};

exports.getToolchainArch = function () {
  var os = /^win/.test (process.platform) ? 'mswindows' : process.platform;
  var arch = process.arch;
  switch (process.arch) {
    case 'x64':  {
      arch = '-' + 'amd64';
      break;
    }
  }
  return os + arch;
};
