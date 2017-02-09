module.exports = {
  entry: './lib/demo-app/main.js',
  output: {
    path: 'dist/demo-app',
    filename: '[name].js'
  },
  target: 'electron'
}
