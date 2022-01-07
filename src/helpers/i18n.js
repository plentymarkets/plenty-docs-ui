'use strict'

module.exports = (...data) => {
  const currentLang = data[0] || 'en-gb'
  const trans = require('./public/_/lang/' + currentLang + '.json')
  return trans[data[1]]
}
