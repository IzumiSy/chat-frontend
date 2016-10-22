var webpack = require('webpack');
var dotenv = require('dotenv');
var path = require('path');

dotenv.config();

module.exports = {
  entry: __dirname + '/js/app.js',

  output: {
    path: __dirname + '/dist',
    filename: 'app.js'
  },

  devServer: {
    contentBase: 'dist',
    port: 8000
  },

  module: {
    loaders: [
      {
        test: /\.css$/,
        loader: 'css-loader'
      }, {
        test: /\.scss$/,
        loader: 'sass-loader'
      }, {
        test: /\.jade$/,
        loader: 'pug-loader'
      }, {
        test: /\.png$/,
        loader: 'file?name=[path][name].[ext]'
      }
    ]
  },

  plugins: [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.AggressiveMergingPlugin(),

    /*
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    */

    new webpack.ProvidePlugin({
      $: 'jquery',
      Vue: 'vue'
    }),

    new webpack.DefinePlugin({
      'process.env': {
        apiServerUrl: () => {
          const env = process.env;
          return JSON.stringify(
            (env.NODE_ENV === "production") ?
              env.PRODUCTION_SERVER :
              env.DEVELOPMENT_SERVER
            )
        }()
      }
    })
  ]
};
