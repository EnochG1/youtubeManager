var path = require('path');
var CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  devtool: 'eval',
  mode: 'none',
  output: {
    path: path.resolve(__dirname, 'dist'),
  },
  devServer: {
    port: 9000,
  },
  plugins: [
		new CopyPlugin(
    [ {from: "assets" } ])
    //  {
    //  patterns: [
    //    { from: "assets", to: "dist" }
    //  ]
    //})
  ],
};