const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const defaultConfig = getDefaultConfig(__dirname);
defaultConfig.resolver.sourceExts.push('cjs');

// Add support for Tamagui
defaultConfig.resolver.assetExts.push('ttf');

// Configure SVG transformer
defaultConfig.transformer.babelTransformerPath = require.resolve('react-native-svg-transformer');

// Apply NativeWind configuration for v4.1.23
module.exports = withNativeWind(defaultConfig, {
    input: './app/globals.css',
    inlineRem: 16,
});
