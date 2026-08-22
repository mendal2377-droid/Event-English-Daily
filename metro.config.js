const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Block Metro from watching orphaned npm temp extraction directories
config.resolver.blockList = [
  /node_modules[/\\]\.[^/\\]+[/\\]/,
];

// Cache on E drive so C drive (system disk) stays free
try {
  const { FileStore } = require('metro-cache');
  config.cacheStores = [new FileStore({ root: 'E:\\metro-cache' })];
} catch (_) {
  // metro-cache not available separately — falls back to default location
}

module.exports = config;
