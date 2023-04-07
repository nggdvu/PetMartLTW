const path = require("path");

module.exports = {
  entry: "./public/index.js",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "public"),
  },
  resolve: {
    fallback: {
      fs: false,
      os: false,
      path: false,
    },
  },
};
