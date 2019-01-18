module.exports = {
  mode: 'production',
  entry: './src/index.ts',
  output: {
    path: require('path').resolve(__dirname, 'dist'),
    filename: 'dockest.bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  devtool: 'inline-source-map',
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
}
