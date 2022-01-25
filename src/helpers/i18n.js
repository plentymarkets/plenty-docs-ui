'use strict'

module.exports = (...data) => {
  const currentLang = data[0] || 'en-gb'
  const trans = require(process.cwd() + '/build/' + currentLang + '/_/lang/' + currentLang + '.json')
  return trans[data[1]]
}
