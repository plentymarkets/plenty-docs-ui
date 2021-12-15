let nextLang = 1
let nextLangTxt = 'en-gb'
let currentLangLabel = 'DE'
let nextLangLabel = 'EN'
if (window.location.pathname.includes('/en-gb/')) {
  nextLang = 0
  nextLangTxt = 'de-de'
  currentLangLabel = 'EN'
  nextLangLabel = 'DE'
}
const thePath = window.location.pathname.replace('.html', '')
let theUrl = '/' + nextLangTxt

$('#langToggle').html(currentLangLabel)
$('#langSelect').html(nextLangLabel)

$('#languagePath').click(function () {
  $.getJSON('mapper.json')
    .done((data) => {
      const langObj = getObjects(data, 'url', thePath)
      // Fallback solution - go to nextlang homepage
      if (!langObj[0] || !langObj[0].languageID) {
        window.location.href = theUrl
      }
      const typic = getObjects(data, 'languageID', langObj[0].languageID)
      // Fallback solution - go to nextlang homepage
      if (!typic[nextLang] || !typic[nextLang].url) {
        window.location.href = theUrl
      }

      if (typic[nextLang].url.includes('/en/')) {
        theUrl = typic[nextLang].url.replace('/en/', '/en-gb/')
      } else {
        theUrl = '/de-de/' + typic[nextLang].url
      }

      window.location.href = theUrl + '.html'
    })
})

function getObjects (obj, key, val) {
  var objects = []
  for (var i in obj) {
    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue
    if (typeof obj[i] === 'object') {
      objects = objects.concat(getObjects(obj[i], key, val))
    } else
    if ((i === key && obj[i] === val) || (i === key && val === '')) {
      objects.push(obj)
    } else if (obj[i] === val && key === '') {
      if (objects.lastIndexOf(obj) === -1) {
        objects.push(obj)
      }
    }
  }
  return objects
}
