const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');

// minify the output with css-minimizer-webpack-plugin

// we can also save space by using less pixi modules!
// https://medium.com/anvoevodin/how-to-set-up-pixijs-v5-project-with-npm-and-webpack-41c18942c88d

// TODO just have the development config extend off of this one if possible

module.exports = {
  entry: './src/client/index.js',
  output: {
    filename: 'omg.js',
    path: path.resolve(__dirname, 'public/dist'),
    publicPath: 'dist'
  },
  mode: "production",
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/client/index.html'
    })
  ],
  module: {
    rules: [
      {
        test: /\.s?css$/i,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      }
    ],
  },
};