const { getDefaultConfig } = require('@expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const defaultConfig = getDefaultConfig(__dirname);
defaultConfig.resolver.sourceExts.push('cjs');

// Add support for Tamagui
defaultConfig.resolver.assetExts.push('ttf');
defaultConfig.transformer.babelTransformerPath = require.resolve('react-native-svg-transformer');

module.exports = withNativeWind(defaultConfig, { input: './app/globals.css' });
