const webpack = require("webpack");
const isProd = process.env.NODE_ENV === "production";

module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/my-project/'
    : '/',
  configureWebpack: {
    // Set up all the aliases we use in our app.
    plugins: [
      new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 6,
      }),
    ],
  },
  pwa: {
    name: "Subscription App",
    themeColor: "#c95fa7",
    msTileColor: "#ffffff",
    appleMobileWebAppCapable: "yes",
    appleMobileWebAppStatusBarStyle: "#c95fa7",
  },
  css: {
    // Enable CSS source maps.
    sourceMap: !isProd,
  },
  devServer: {
    disableHostCheck: true,
    host: "127.0.0.1",
    port: 8080,
    public: "localhost:8080",
  },
};
