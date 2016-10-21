module.exports = {
  entry: __dirname + '/js/app.js',
  output: {
    path: __dirname + '/dist',
    filename: 'app.js'
  },
  module: {
    loaders: [
      { test: /\.css$/, loader: 'css-loader' },
      { test: /\.scss$/, loader: 'sass-loader' },
      { test: /\.jade$/, loader: 'pug-loader' }
    ]
  }
};
