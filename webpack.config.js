var webpack = require('webpack');
var dotenv = require('dotenv');
var transferWebpackPlugin = require('transfer-webpack-plugin');

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
        loader: 'style-loader!css-loader'
      }, {
        test: /\.scss$/,
        loader: 'style-loader!css-loader!sass-loader'
      }, {
        test: /\.jade$/,
        loader: 'pug-loader'
      }, {
        test: /\.(png|svg|eot|ttf|woff)(\?.*)?$/,
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
      jQuery: 'jquery',
      Vue: 'vue'
    }),

    new transferWebpackPlugin([
       {
         from: 'node_modules/flat-ui/images/icons/png',
         to: '/assets'
       }
    ]),

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
  ],

  resolve: {
    modulesDirectories: [
      "node_modules", "libs"
    ]
  }
};
