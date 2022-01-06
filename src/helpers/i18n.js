'use strict'

module.exports = (...data) => {
  const currentLang = data[0] || 'en'
  const trans = require('./public/_/lang/' + currentLang + '.json')
  return trans[data[1]]
}
