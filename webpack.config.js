module.exports = {
  entry: {
    main: './lib/demo-app/main.js',
   // render: './lib/demo-app/render.js'
  },
  output: {
    path: 'dist/demo-app',
    filename: '[name].js'
  },
  target: 'electron'
}
