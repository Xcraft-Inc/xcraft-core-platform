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
