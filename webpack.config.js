const path = require("path");

module.exports = {
  mode: 'development', // Modo de desarrollo
  entry: {
    app: './public/js/app.js',
    alert: './public/js/alert.js'
  },
  output: {
    filename: '[name].bundle.js', // [name] será reemplazado por el nombre de cada entrada
    path: path.join(__dirname, "./public/dist")
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  }
};
