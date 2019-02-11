const path = require('path');
const HtmlPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ResponsiveJSONWebpackPlugin = require("responsive-json-webpack-plugin");
const ImageminWebpWebpackPlugin= require("imagemin-webp-webpack-plugin");
const WebpackBar = require('webpackbar');

const getPath = p => path.resolve(__dirname, p);

module.exports = {
  entry: {
    vendor: [
      getPath('assets/js/vendor.js'),
      getPath('assets/scss/vendor.scss')
    ],
    app: [
      getPath('assets/js/main.js'),
      getPath('assets/scss/main.scss')
    ]
  },
  output: {
    path: getPath('dist'),
    publicPath: '/',
    filename: 'js/[name].[chunkhash].js'
  },
  module: {
    rules: [

      {
        test: /\.html$/,
        use: [
          'html-loader',
          {
            loader: 'posthtml-loader',
            options: {
              plugins: [
                require('posthtml-expressions')({
                  locals: {
                    data: require(getPath('locals.json')),
                    picture: (url, alt="", ext="jpg") => `
                      <picture>
                        <!--[if IE 9]><video style="display: none;><![endif]-->
                        <source data-srcset="${url}@1x.webp 1x, ${url}@2x.webp 2x" type="image/webp">
                        <source data-srcset="${url}@1x.${ext} 1x, ${url}@2x.${ext} 2x" type="image/${ext==="jpg" ? "jpeg" : ext}">
                        <!--[if IE 9]></video><![endif]-->
                        <img class="lazyload" data-src="${url}@1x.${ext}" alt="${alt}">
                      </picture>
                    `,
                  }
                })
              ]
            }
          }
        ]
      },

      {
        test: /\.scss$/,
        use: [
          "style-loader",
          MiniCssExtractPlugin.loader,
          "css-loader",
          "sass-loader"
        ]
      },

      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },

      {
        test: /\.(jpe?g|png)$/i,
        loaders: [
          'file-loader'
        ]
      }

    ]
  },
  plugins: [
    new WebpackBar({
      profile: true
    }),
    new CleanWebpackPlugin(['dist']),
    new ResponsiveJSONWebpackPlugin({
      sourceTemplates: "assets/img/templates",
      sourceImages: "assets/img",
      outputFolder: ""
    }),
    new ImageminWebpWebpackPlugin({
      config: [{
        test: /\.(jpe?g|png)/,
        options: {
          quality: 85
        }
      }],
      overrideExtension: true,
      detailedLogs: false,
      strict: true
    }),
    new CopyWebpackPlugin([
      {
        from: 'assets/img/*.svg',
        to: 'images',
        toType: 'dir',
        flatten: true
      },
      {
        from: 'assets/img/og_image.jpg',
        to: 'images'
      },
      {
        from: 'assets/font/*.*',
        to: 'font',
        toType: 'dir',
        flatten: true
      },
      'assets/.nojekyll',
      'assets/favicon.ico',
      'assets/CNAME',
      'pages/404.html'
    ]),
    new MiniCssExtractPlugin({
      filename: "css/[name].[contenthash].css",
      chunkFilename: "css/[id].[contenthash].css"
    }),
    new HtmlPlugin({
      inject: true,
      hash: true,
      template: getPath('pages/index.html'),
      filename: 'index.html'
    })
  ],
  devServer: {
    open: true,
    contentBase: [getPath('dist')]
  }
};
