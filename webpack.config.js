const path = require('path');

module.exports = {
    entry:{
      main: path.join(__dirname, "src", "index.js"),
      mMusic: path.join(__dirname, "src", "music.js"),
      mFilm: path.join(__dirname, "src", "film.js"),
      mMedia: path.join(__dirname, "src", "media.js"),
      mRegister: path.join(__dirname, "src", "register.js"),
      mReset: path.join(__dirname, "src", "password_reset.js"),
      mLogin: path.join(__dirname, "src", "login.js"),


    }, 
    output: {
        path:path.resolve(__dirname, "dist"),
        filename: "[name].min.js"
    },
    module: {
        rules: [
          {
            test: /\.?js$/,
            exclude: /node_modules/,
            use: {
              loader: "babel-loader",
              options: {
                presets: ['@babel/preset-env', '@babel/preset-react']
              }
            }
          },
          {
            test: /\.css$/,
            use: [
              'style-loader',
              'css-loader'
            ]
          },
        ]
      },
}
