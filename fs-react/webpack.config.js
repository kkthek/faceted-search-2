const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  entry: './src/index.tsx',
  module: {
    rules: [
      {
        test: /\.(tsx|ts)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: './index.html',
    }),
  ],
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
    alias: {
        '@mui/styled-engine': '@mui/styled-engine-sc'
    }
  },
  devServer: {
    port: 9000,
    proxy: [
      {
        context: ['/documents'],
        target: 'http://localhost/mediawiki/rest.php/FacetedSearch2/v1/proxy',
        changeOrigin: true,
      },
      {
        context: ['/stats'],
        target: 'http://localhost/mediawiki/rest.php/FacetedSearch2/v1/proxy',
        changeOrigin: true,
      },
      {
        context: ['/facets'],
        target: 'http://localhost/mediawiki/rest.php/FacetedSearch2/v1/proxy',
        changeOrigin: true,
      },
      {
        context: ['/document-by-id'],
        target: 'http://localhost/mediawiki/rest.php/FacetedSearch2/v1/proxy',
        changeOrigin: true,
      },
      {
        context: ['/settings'],
        target: 'http://localhost/mediawiki/rest.php/FacetedSearch2/v1',
        changeOrigin: true,
      },
      {
        context: ['/sample-group-hierarchy'],
        target: 'http://localhost/mediawiki/rest.php',
        changeOrigin: true,
      }
    ],
  }
};