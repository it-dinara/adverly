const { hostname } = require("os");
const path = require("path");

module.exports = {
  entry: "./src/index.tsx",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  resolve: {
    alias: {
      Pages: path.resolve(__dirname, "src/pages"),
      Redux: path.resolve(__dirname, "src/redux"),
      AxiosInstance: path.resolve(__dirname, "src/axios-adverly.ts"),
      Types: path.resolve(__dirname, "src/types"),
    },
    extensions: [".ts", ".tsx", ".js"],
  },

  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              modules: {
                namedExport: false,
                localIdentName: "[folder]__[local]--[hash:base64:5]",
                exportLocalsConvention: "camelCase", // Ensure proper exports
              },
            },
          },
        ],
        include: /\.module\.css$/,
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
        exclude: /\.module\.css$/,
      },
      {
        test: /\.json$/,
        type: "asset/resource",
        generator: {
          filename: "data/[name][ext]",
        },
      },
    ],
  },
  devServer: {
    devMiddleware: {
      writeToDisk: true,
    },
    static: {
      directory: path.join(__dirname, "public"),
    },
    hot: true,
    watchFiles: ["src/**/*"],
    host: "0.0.0.0",
    port: 8081,
    compress: true,
    historyApiFallback: true,
    proxy: [
      {
        context: ["/api"],
        target: "backend:3000",
        secure: false,
      },
    ],
    port: 8081,
    historyApiFallback: true,
  },
  mode: "development",
};
