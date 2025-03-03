import path from 'path';
import { fileURLToPath } from 'url';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const baseConfig = {
  target: "node",
  entry: "./src/index.js",
  devtool: "source-map",
  experiments: {
    topLevelAwait: true,
    outputModule: true
  },
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "dist"),
    library: {
      type: "module"
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
                modules: false
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

export default (_, argv) => {
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
