const { override, fixBabelImports, addLessLoader, disableEsLint, overrideDevServer } = require('customize-cra');

process.env.PORT = 9000;

module.exports = {
  webpack: override(
    disableEsLint(),
    fixBabelImports('import', {
      libraryName: 'antd',
      libraryDirectory: 'es',
      style: true,
    }),
    addLessLoader({
      javascriptEnabled: true,
      modifyVars: { '@primary-color': '#1DA57A' },
    }),
  ),
  devServer: overrideDevServer(
    (() => config => {
      config = Object.assign(config, {
        historyApiFallback: true, // 配合BrowserRouter
        proxy: {
          '/t2': {
            target: 'http://localhost:3000',
            secure: false
          },
          '/upload': {
            target: 'http://localhost:3000',
            secure: false
          }
        }
      })
      return config
    })()
  )
}