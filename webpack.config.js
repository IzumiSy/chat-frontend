var webpack = require('webpack')
var dotenv = require('dotenv')

dotenv.config();

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
  },
  plugins: [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),

    new webpack.DefinePlugin({
      'process.env': {
        apiServerUrl: (env === "production") ?
          process.env.PRODUCTION_SERVER :
          process.env.DEVELOPMENT_SERVER;
      }
    })
  ]
};
