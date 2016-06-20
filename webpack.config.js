module.exports = {
  context: __dirname,
  entry: "./app.js",
  output: {
    path: './public/javascripts',
    filename: "bundle.js",
    devtoolModuleFilenameTemplate: '[resourcePath]',
    devtoolFallbackModuleFilenameTemplate: '[resourcePath]?[hash]'
  },
  module: {
    loaders: [
      {
        test: [/\.ejs?$/, /\.js?$/],
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ["es2015"]
        }
      },
      {
        test: /\.json?$/,
        loader: 'json'
      },
    ]
  },
  resolve: {
    extensions: ["", ".js", ".ejs", ".json"]
  },
  node: {
    fs: "empty",
    net: "empty",
    tls: "empty"
  },
  devtool: 'source-maps'
};
