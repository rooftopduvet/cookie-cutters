const {
  getUnpkgURL,
  getCdnjsURL,
} = require(`${__dirname}/../scripts/get-cdn-url`)

module.exports.getExternals = function(isProduction) {
  return [
    {
      name: 'lodash',
      src: getUnpkgURL('lodash', 'lodash.min.js'),
      globalVarName: '_',
    },
    {
      name: 'react',
      src: getUnpkgURL(
        'react',
        isProduction ? 'umd/react.production.min.js' : 'umd/react.development.js'
      ),
      globalVarName: 'React',
    },
    {
      name: 'react-dom',
      src: getUnpkgURL(
        'react-dom',
        isProduction ? 'umd/react-dom.production.min.js' : 'umd/react-dom.development.js'
      ),
      globalVarName: 'ReactDOM',
    },
    {
      name: 'react-router',
      src: getUnpkgURL('react-router', 'umd/react-router.min.js'),
      globalVarName: 'ReactRouter',
    },
    {
      name: 'react-router-dom',
      src: getUnpkgURL('react-router-dom', 'umd/react-router-dom.min.js'),
      globalVarName: 'ReactRouterDOM',
    },
  ]
}