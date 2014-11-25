module.exports = {
  entry: './app/main',
  output: {
    path: __dirname + '/dist',
    filename: 'main.js',
  },
  debug: true,
  module: {
    loaders: [
      { test: /\.js$/, loader: 'jsx-loader?harmony=true'},
    ]
  }
}
