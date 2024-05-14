module.exports = {
  root: true,
  extends: ['@react-native', 'prettier'],
};

module.exports = {
  root: true,
  extends: [
    // '@react-native-community',
    '@react-native',
    'prettier'
  ],
  rules: {
    'prettier/prettier': [
      error,
      {
        trailingComma: 'all',
        singleQuote: true,
        printWidth: 120,
        tabWidth: 2,
        useTabs: false
      }
    ]
  },
  ignore: [
    "node_modules/",
    "lib/"
  ],
}
