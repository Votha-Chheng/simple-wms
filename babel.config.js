module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    "optional-require",
    [
      "@babel/plugin-proposal-decorators", 
      { "legacy": true },
    ]
  ]
};
