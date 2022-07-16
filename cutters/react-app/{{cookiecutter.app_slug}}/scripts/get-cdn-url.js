const getPackageVersion = require(`${__dirname}/get-package-version`)

const UNPKG_BASE_URL = 'https://unpkg.com'
const CDNJS_BASE_URL = 'https://cdnjs.cloudflare.com/ajax/libs'

module.exports.getUnpkgURL = function(pkgName, filename) {
  return `${UNPKG_BASE_URL}/${pkgName}@${getPackageVersion(pkgName)}/${filename}`
}

module.exports.getCdnjsURL = function(pkgName, libName, filename) {
  return `${CDNJS_BASE_URL}/${libName}/${getPackageVersion(pkgName)}/${filename}`
}

