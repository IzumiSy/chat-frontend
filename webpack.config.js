module.exports = {
  entry: __dirname + '/js/app.js',
  output: {
    path: __dirname + '/dist',
    filename: '[name].js'
  },
  module: {
    loaders: [
      { test: /\.css$/, loader: ['style', 'css'] },
      { test: /\.scss$/, loader: ['style', 'css', 'sass'] }
    ]
  }
};
