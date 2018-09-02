const webpack = require('webpack');
const dotenv = require('dotenv');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

dotenv.config();
const env = process.env;

module.exports = {
  target: 'web',

  entry: __dirname + '/src/app.js',

  output: {
    path: __dirname + '/dist',
    filename: 'app.js'
  },

  devtool: 'source-map',

  devServer: {
    contentBase: './dist',
    port: 8000,
    hot: true
  },

  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: /(node_modules|libs)/,
        loader: 'eslint-loader'
      }, {
        test: /\.js$/,
        exclude: /(node_modules|libs)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }, {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      }, {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ]
      }, {
        test: /\.jade$/,
        use: ['pug-loader']
      }, {
        test: /\.(png|svg|eot|ttf|woff)(\?.*)?$/,
        use: ['file-loader']
      }
    ]
  },

  plugins: [
    new UglifyJSPlugin({
      sourceMap: true
    }),

    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),

    new CleanWebpackPlugin([
      'dist'
    ]),
    new HtmlWebpackPlugin({
      template: 'index.html'
    }),

    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(env.NODE_ENV),
        apiServerUrl: (() => {
          return JSON.stringify(
            (env.NODE_ENV === "production") ?
              env.PRODUCTION_SERVER :
              env.DEVELOPMENT_SERVER
            )
        })()
      }
    }),

    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      Vue: 'vue'
    }),

    new CopyWebpackPlugin([
      {
        from: 'node_modules/flat-ui/images/icons/png',
        to: 'assets/icons'
      }, {
        from: 'assets/',
        to: 'assets/faces'
      }
    ])
  ],

  resolve: {
    modules: [
      "node_modules", "libs"
    ]
  }
};
