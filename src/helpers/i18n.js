'use strict'

module.exports = (...data) => {
  const path = process.cwd()
  const currentLang = data[0] || 'en-gb'
  const inputKey = data[1]
  const splitKey = inputKey.split('.')
  const splitKeyElements = splitKey.length
  const keyElementZero = splitKey[0]
  const keyElementOne = splitKey[1]
  const keyElementTwo = splitKey[2]
  const keyElementThree = splitKey[3]
  const keyElementFour = splitKey[4]
  const keyElementFive = splitKey[5]
  const keyElementSix = splitKey[6]
  const keyElementSeven = splitKey[7]
  const keyElementEight = splitKey[8]
  const keyElementNine = splitKey[9]
  let translation = 'Lorem ipsum'
  let langJson = ''
  if (process.env.GITHUB_ACTION) {
    langJson = require(path + '/lang/' + currentLang + '.json')
  } else if (path.includes('plenty-docs-ui')) {
    langJson = require(path + '/public/_/lang/' + currentLang + '.json')
  } else {
    return translation
  }
  switch (splitKeyElements) {
    case 1:
      translation = langJson[keyElementZero]
      break
    case 2:
      translation = langJson[keyElementZero][keyElementOne]
      break
    case 3:
      translation = langJson[keyElementZero][keyElementOne][keyElementTwo]
      break
    case 4:
      translation = langJson[keyElementZero][keyElementOne][keyElementTwo][keyElementThree]
      break
    case 5:
      translation = langJson[keyElementZero][keyElementOne][keyElementTwo][keyElementThree][keyElementFour]
      break
    case 6:
      translation = langJson[keyElementZero][keyElementOne][keyElementTwo][keyElementThree][keyElementFour][keyElementFive]
      break
    case 7:
      translation = langJson[keyElementZero][keyElementOne][keyElementTwo][keyElementThree][keyElementFour][keyElementFive][keyElementSix]
      break
    case 8:
      translation = langJson[keyElementZero][keyElementOne][keyElementTwo][keyElementThree][keyElementFour][keyElementFive][keyElementSix][keyElementSeven]
      break
    case 9:
      translation = langJson[keyElementZero][keyElementOne][keyElementTwo][keyElementThree][keyElementFour][keyElementFive][keyElementSix][keyElementSeven][keyElementEight]
      break
    case 10:
      translation = langJson[keyElementZero][keyElementOne][keyElementTwo][keyElementThree][keyElementFour][keyElementFive][keyElementSix][keyElementSeven][keyElementEight][keyElementNine]
      break
    default:
      translation = 'Lorem ipsum'
      break
  }
  return translation
}
