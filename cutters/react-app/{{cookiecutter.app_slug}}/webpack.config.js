const path = require('path')
const webpack = require('webpack')
const TerserPlugin = require("terser-webpack-plugin")
const HtmlWebpackPlugin = require('html-webpack-plugin')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const { getExternals } = require('./config/externals')
const { makeHTMLSubstitutions } = require('./config/html-substitutions')

const env = {
  ASSET_PATH: process.env.ASSET_PATH || '/',
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || '8080',
}

const isProduction = (env.NODE_ENV === 'production')

const distDir = path.resolve(__dirname, 'dist')
const externals = getExternals(isProduction)

//--------------------------------------------------------------------------------

let plugins = [
  new webpack.DefinePlugin({
    'process.env.ASSET_PATH': JSON.stringify(env.ASSET_PATH),
  }),
  new HtmlWebpackPlugin({
    filename: 'index.html',
    template: 'index.html',
    ...makeHTMLSubstitutions(env.ASSET_PATH, externals),
  }),
  new CopyPlugin({
    patterns: [
      { from: 'public', to: distDir },
    ],
  })
]

if (!isProduction) {
  plugins = [
    ...plugins,
    new BundleAnalyzerPlugin({
      analyzerHost: '0.0.0.0',
      analyzerPort: 8088,
      openAnalyzer: false,
    })
  ]
}

//--------------------------------------------------------------------------------

module.exports = {
  entry: './src/index.tsx',
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    plugins: [
      new TsconfigPathsPlugin()
    ]
  },
  externals: externals.reduce(
    (res, external) => ({
      ...res,
      [external.name]: external.globalVarName,
    }), {}
  ),
  devtool: 'inline-source-map',
  mode: env.NODE_ENV,
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          'style-loader',
          // Translates CSS into CommonJS
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: 'teaocha-[name]--[local]--[hash:base64:5]',
              }
            },
          },
          // Compiles Sass to CSS
          'sass-loader',
          // Enables auto-prexing etc
          'postcss-loader',
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        use: {
          loader: 'file-loader',
          options: {
            name(resourcePath, resourceQuery) {
              // `resourcePath` - `/absolute/path/to/file.js`
              // `resourceQuery` - `?foo=bar`

              if (isProduction) {
                return '[path][name]_[contenthash].[ext]'
              }

              return '[path][name].[ext]'
            },
          },
        },
      },
    ],
  },
  optimization: {
    splitChunks: {
      chunks: 'async',
      minSize: 20000,
      minRemainingSize: 0,
      minChunks: 1,
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      enforceSizeThreshold: 50000,
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          reuseExistingChunk: true,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
    minimize: isProduction,
    minimizer: [
      new TerserPlugin({
        extractComments: true,
      })
    ],
  },
  plugins,
  devServer: {
    port: env.port,
    host: '0.0.0.0',
    hot: true,
    historyApiFallback: true,
  },
  output: {
    filename: isProduction ? 'bundle_[contenthash].min.js' : 'bundle.js',
    path: distDir,
    publicPath: env.ASSET_PATH,
  },
}