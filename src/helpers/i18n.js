'use strict'

module.exports = (...data) => {
  const currentLang = data[0] || 'en-gb'
  const path = process.cwd()
  let trans = 'Lorem ipsum'
  if (process.env.GITHUB_ACTION) {
    trans = require(path + '/lang/' + currentLang + '.json')
  } else if (path.includes('plenty-docs-ui')) {
    trans = require(path + '/public/_/lang/' + currentLang + '.json')
  } else {
    return trans
  }
  return trans[data[1]]
}
