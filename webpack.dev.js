const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

const LiveReloadPlugin = require("webpack-livereload-plugin");
const OpenBrowserPlugin = require("open-browser-plugin");

module.exports = merge(common, {
  mode: "development",
  plugins: [
    new LiveReloadPlugin({
        port: 9000,
        appendScriptTag: true
    }),
    new OpenBrowserPlugin({
      port: 8080
    })
  ]
});