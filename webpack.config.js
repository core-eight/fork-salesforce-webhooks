const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const baseConfig = {
  target: "node",
  entry: "./src/index.js",
  devtool: "source-map",
  experiments: {
    topLevelAwait: true,
  },
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "dist"),
    library: {
      type: "commonjs2"
    },
    clean: true
  },
  resolve: {
    alias: {
      handlebars: "handlebars/runtime.js",
    },
    extensions: ['.js', '.jsx', '.json']
  },
  module: {
    rules: [
      {
        test: /\.handlebars$/,
        loader: "handlebars-loader",
        options: {
          noEscape: true
        }
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', {
                targets: {
                  node: 'current',
                },
                modules: 'commonjs'
              }]
            ],
            plugins: ['@babel/plugin-transform-runtime']
          }
        }
      }
    ],
  },
  plugins: [new CleanWebpackPlugin()]
};

const productionConfig = {
  mode: 'production',
  devtool: "eval-source-map",
  optimization: {
    minimize: false,
    moduleIds: "size",
    removeAvailableModules: true,
  },
};

const developmentConfig = {
  mode: 'development',
  devtool: "eval-source-map",
  optimization: {
    moduleIds: "named",
  },
};

module.exports = (_, argv) => {
  const { mode = "production" } = argv;

  if (mode === "production") {
    return {
      ...baseConfig,
      ...productionConfig,
    };
  }

  if (mode === "development") {
    return {
      ...baseConfig,
      ...developmentConfig,
    };
  }
};
