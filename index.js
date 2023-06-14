'use strict';

exports.getOs = function () {
  return /^win/.test(process.platform) ? 'win' : process.platform;
};

exports.getExecExt = function () {
  return /^win/.test(process.platform) ? '.exe' : '';
};

exports.getShellExt = function () {
  return /^win/.test(process.platform) ? '.bat' : '';
};

exports.getShellExtArray = function () {
  return ['.bat', ''];
};

exports.getCmdExt = function () {
  return /^win/.test(process.platform) ? '.cmd' : '';
};

exports.getArch = function () {
  let arch = process.arch;

  switch (process.arch) {
    case 'x64': {
      arch = 'amd64';
      break;
    }
    case 'arm64': {
      arch = 'aarch64';
      break;
    }
  }

  return arch;
};

exports.getToolchainArch = function () {
  const os = /^win/.test(process.platform) ? 'mswindows' : process.platform;
  const arch = exports.getArch();
  return `${os}-${arch}`;
};

exports.getArchVariant = function (arch) {
  switch (arch) {
    case 'x32':
      return 'x86_32';
    case 'x64':
      return 'x86_64';
    default:
      return arch;
  }
};
