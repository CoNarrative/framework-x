const path = require('path')
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')

module.exports = {
  entry: './src/lib.js',

  devtool:'source-map',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
    libraryTarget: 'umd',
  },

  externals: {
    react: {
      root: 'React',
      commonjs2: 'react',
      commonjs: 'react',
      amd: 'react'
    },
    'react-dom': {
      root: 'ReactDOM',
      commonjs2: 'react-dom',
      commonjs: 'react-dom',
      amd: 'react-dom'
    },

    'ramda': 'ramda',
    'framework-x': 'framework-x',
  },
  optimization: {
    splitChunks: {
      chunks:(a)=> a.name==='main'&&console.log('fall',a)
    }
  },

  module: {
    // noParse: [
      // /node_modules\/framework-x/,
      // /node_modules\/ramda/,
      // /node_modules\/react/,
      // /node_modules\/react-dom/,
    // ],
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }]
  },

  plugins: [
    new MonacoWebpackPlugin(
      {
        features: [
          'accessibilityHelp',
          'bracketMatching',
          'caretOperations',
          'clipboard',
          'codeAction', 'codelens',
          'colorDetector',
          'comment',
          'contextmenu',
          'coreCommands',
          'cursorUndo',
          'dnd',
          'find',
          'folding',
          'fontZoom',
          'format',
          'goToDefinitionCommands',
          'goToDefinitionMouse',
          'gotoError',
          'gotoLine',
          'hover',
          'inPlaceReplace',
          'inspectTokens',
          'iPadShowKeyboard',
          'linesOperations',
          'links',
          'multicursor',
          'parameterHints',
          'quickCommand',
          'quickOutline',
          'referenceSearch',
          'rename',
          'smartSelect',
          'snippets',
          'suggest',
          'toggleHighContrast',
          'toggleTabFocusMode',
          'transpose',
          'wordHighlighter',
          'wordOperations',
          'wordPartOperations'
        ],
        languages: [
          'json',
          'javascript',
          'typescript'
          // 'apex', 'azcli', 'bat', 'clojure', 'coffee', 'cpp', 'csharp', 'csp', 'css', 'dockerfile', 'fsharp', 'go', 'handlebars', 'html', 'ini', 'java', 'javascript', 'json', 'less', 'lua', 'markdown', 'msdax', 'mysql', 'objective', 'perl', 'pgsql', 'php', 'postiats', 'powerquery', 'powershell', 'pug', 'python', 'r', 'razor', 'redis', 'redshift', 'ruby', 'rust', 'sb', 'scheme', 'scss', 'shell', 'solidity', 'sql', 'st', 'swift', 'typescript', 'vb', 'xml', 'yaml'
        ]
      }
    )
  ]
}
