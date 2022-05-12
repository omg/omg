const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");

// minify the output with css-minimizer-webpack-plugin

// we can also save space by using less pixi modules!
// https://medium.com/anvoevodin/how-to-set-up-pixijs-v5-project-with-npm-and-webpack-41c18942c88d

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devServer: {
    watchFiles: ["src/*.html"],
    hot: true,
  },
  module: {
    rules: [
      {
        test: /\.s?css$/i,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      inject: false
    }),
    new CopyPlugin({
      patterns: [
        { from: "./src/assets", to: "assets" }
      ],
    }),
  ]
};