const { getDefaultConfig } = require('expo/metro-config');
const escape = require('escape-string-regexp');
const path = require('path');

const root = path.resolve(__dirname, '..');
const pak = require('../package.json');
const regList = [/\/__tests__\/.*/];

const blacklist = (additionalExclusions) => new RegExp(
  "(" +
  (additionalExclusions || []).concat(regList).join("|") +
  ")$"
);

const modules = Object.keys({
  ...pak.dependencies,
  ...pak.peerDependencies,
});

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('expo/metro-config').MetroConfig}
 */
const config = getDefaultConfig(__dirname);

config.projectRoot = __dirname;
config.watchFolders = [root, __dirname];

config.resolver = {
  ...config.resolver,
  blacklistRE: blacklist(
    modules.map(
      (m) =>
        new RegExp(`^${escape(path.join(root, 'node_modules', m))}\\/.*$`)
    )
  ),
  extraNodeModules: modules.reduce((acc, name) => {
    acc[name] = path.join(__dirname, 'node_modules', name);
    return acc;
  }, {}),
};

module.exports = config;
