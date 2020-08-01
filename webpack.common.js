import path from 'path';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

const src = path.resolve(__dirname, 'src');
const dst = path.resolve(__dirname, 'dst');

export default {
  mode: 'none',

  entry: {
    main: path.resolve(src, 'main.jsx'),
  },

  output: {
    path: dst,
    filename: '[name].bundle.js',
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env',
                '@babel/preset-react',
              ],
            },
          },
        ],
      },

      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              url: false,
            },
          },
        ],
      },

      {
        test: /\.(jpg|gif|png)$/,
        loader: 'url-loader',
      },

      {
        test: /\.svg$/,
        loader: '@svgr/webpack',
      },
    ],
  },

  plugins: [
    new MiniCssExtractPlugin({
      path: dst,
      filename: '[name].bundle.css',
    }),
  ],

};
