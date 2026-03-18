const path = require('path');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const uppercamelcase = require('uppercamelcase');

const Components = require('../business/components.json');
const config = require('./config');

const outputPath = path.resolve(process.cwd(), './dist/business');
const publicPath = '/dist/business/';

const sharedRules = [
  {
    test: /\.(jsx?|babel|es6)$/,
    include: process.cwd(),
    exclude: config.jsexclude,
    loader: 'babel-loader'
  },
  {
    test: /\.vue$/,
    loader: 'vue-loader',
    options: {
      compilerOptions: {
        preserveWhitespace: false
      }
    }
  },
  {
    test: /\.css$/,
    use: [MiniCssExtractPlugin.loader, 'css-loader']
  },
  {
    test: /\.(svg|otf|ttf|woff2?|eot|gif|png|jpe?g)(\?\S*)?$/,
    loader: 'url-loader',
    query: {
      limit: 10000,
      name: path.posix.join('static', '[name].[hash:7].[ext]')
    }
  }
];

function createBusinessConfig(entryName, entryPath, libraryName) {
  return {
    mode: 'production',
    entry: {
      [entryName]: entryPath
    },
    output: {
      path: outputPath,
      publicPath,
      filename: '[name].min.js',
      chunkFilename: '[id].js',
      library: libraryName,
      libraryTarget: 'umd',
      libraryExport: 'default',
      umdNamedDefine: true,
      globalObject: 'typeof self !== \'undefined\' ? self : this'
    },
    resolve: {
      extensions: ['.js', '.vue', '.json'],
      alias: config.alias,
      modules: ['node_modules']
    },
    externals: {
      vue: config.vue
    },
    performance: {
      hints: false
    },
    stats: 'none',
    optimization: {
      minimize: false,
      splitChunks: false,
      runtimeChunk: false
    },
    module: {
      rules: sharedRules
    },
    plugins: [
      new ProgressBarPlugin(),
      new VueLoaderPlugin(),
      new MiniCssExtractPlugin({
        filename: '[name].min.css'
      })
    ]
  };
}

module.exports = [
  createBusinessConfig('index', './business/index.js', 'ELEMENT_BUSINESS'),
  ...Object.keys(Components).map(name => createBusinessConfig(name, Components[name], uppercamelcase(name)))
];
