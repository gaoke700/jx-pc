var path = require('path');
var glob = require('glob');
var webpack = require('webpack');
var Fs = require('fs');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var StylelintPlugin = require('stylelint-webpack-plugin');
var InlineManifestWebpackPlugin = require('inline-manifest-webpack-plugin');
var utils = require('./utils');
var config = require('../config');
var vueLoaderConfig = require('./vue-loader.conf');

function resolve(dir) {
  return path.join(__dirname, '..', dir);
}

var entries = {}
var HtmlPlugins = []
var isProd = process.env.NODE_ENV === 'production';

let changeColorContent = '';
let jsConfig = '';
if(config.frontMode == 'shop'){
  changeColorContent = Fs.readFileSync('./src/styles/version-style/change-color-default.scss','utf-8');
  jsConfig = Fs.readFileSync('./src/utils/config-shop.js','utf-8');
} else {
  changeColorContent = Fs.readFileSync('./src/styles/version-style/change-color-jx.scss','utf-8');
  jsConfig = Fs.readFileSync('./src/utils/config-jx.js','utf-8');
}
Fs.writeFileSync( './src/styles/version-style/change-color.scss', changeColorContent );
Fs.writeFileSync( './src/utils/config.js', jsConfig );

entries.config = './src/utils/config.js';
entries.switchMboileUrl = './src/utils/switchMboileUrl.js',
glob.sync('./src/pages/**/app.js').forEach(path => {
  var chunk = /src\/pages\/(\S+)\/app\.js/.exec(path)[1]
  var filename = chunk + '.html'

  entries[chunk] = path

  HtmlPlugins.push(new HtmlWebpackPlugin({
    filename: filename,
    template: (isProd ? 'src/pages/index.ejs' : 'src/pages/index-dev.ejs'),
    // inject: true,
    frontMode: config.frontMode,
    title: (config.frontMode == 'shop' ? '' : '京选好店'),
    // favicon: './src/assets/favicon.ico',
    favicon: (config.frontMode == 'shop' ? './src/assets/favicon-shop.ico' : './src/assets/favicon.ico'),
    hash: isProd,
    inject: {
      head: ['switchMboileUrl'],
      body: ['vendor', chunk]
    },
    chunks: ['switchMboileUrl', 'vendor', chunk],
    minify: isProd ? {
      removeComments: true,
      collapseWhitespace: true,
      removeAttributeQuotes: true,
      chunksSortMode: 'dependency'
    } : {
      collapseWhitespace: true,
    }
  }))
})
module.exports = {
  entry: entries,
  output: {
    // path: config.build.assetsRoot,
    path: isProd ? config.build.assetsRoot : path.resolve(__dirname, '../dist'),
    filename: '[name].js',
    publicPath: isProd ? config.build.assetsPublicPath : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      '@': resolve('src'),
      'api': resolve('src/api'),
      'assets': resolve('src/assets'),
      'components': resolve('src/components'),
      'pages': resolve('src/pages'),
      'store': resolve('src/store'),
      'utils': resolve('src/utils'),
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: [resolve('src'), resolve('test')],
        options: {
          formatter: require('eslint-friendly-formatter')
        }
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [
          resolve('src'),
          resolve('test'),
          resolve('node_modules/element-ui/packages'),
          resolve('node_modules/element-ui/src')
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.html$/,
        use: [{
          loader: 'html-loader',
          options: {
            root: resolve(__dirname, 'src'),
            attrs: ['img:src', 'link:href']
          }
        }]
      }
    ]
  },
  plugins: [
    ...HtmlPlugins,
    new StylelintPlugin({
      files: ['src/**/*.vue', 'src/**/*.scss'],
      syntax: 'scss'
    }),
    new InlineManifestWebpackPlugin(),
  ]
}
