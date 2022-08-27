const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');

// minify the output with css-minimizer-webpack-plugin

// we can also save space by using less pixi modules!
// https://medium.com/anvoevodin/how-to-set-up-pixijs-v5-project-with-npm-and-webpack-41c18942c88d

// old npm script "build:release": "webpack --optimize-minimize --config webpack.prod.js",

module.exports = {
  entry: './src/client/index.js',
  output: {
    filename: 'omg.js',
    path: path.resolve(__dirname, 'public/dist'),
    publicPath: 'dist'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/client/index.html'
    })
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [{
          loader: 'ts-loader',
          options: {
            configFile: "tsconfig.webpack.json"
          }
        }],
        exclude: /node_modules/,
      },
      {
        test: /\.s[ac]ss$/i,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts/'
            }
          }
        ]
      }
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
};