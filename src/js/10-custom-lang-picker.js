const currentLocation = window.location.pathname
const locationObj = currentLocation.includes('/en-gb/') ? currentLocation.split('/en-gb/') : currentLocation.split('/de-de/')
const semifinalPath = locationObj[1].includes('manual/main') ? locationObj[1].split('manual/main')[1] : '/' + locationObj[1]
const ll = locationObj[1].includes('manual/main') ? '/manual/main' : '/'

let nextLang = 1
let nextLangTxt = 'en-gb'
let currentLangLabel = 'DE'
let nextLangLabel = 'EN'
let searchLang = ''
if (currentLocation.includes('en-gb')) {
  nextLang = 0
  nextLangTxt = 'de-de'
  currentLangLabel = 'EN'
  nextLangLabel = 'DE'
  searchLang = ''
}
const finalPath = searchLang + semifinalPath.replace('.html', '') //the path to search inside json
const theUrl = locationObj[0] + '/' + nextLangTxt + ll

if (!window.localStorage.getItem('dataLangItems')) {
  $.getJSON('../../../_/lang/mapper.json')
    .done((data) => {
      window.localStorage.setItem('dataLangItems', JSON.stringify(data))
    })
}

$('#langToggle').html(currentLangLabel)
$('#langSelect').html(nextLangLabel)

$('#languagePath').click(function () {
  if (finalPath === '/' || finalPath === '/en/') {
    window.location.href = theUrl + '/index.html'
  }

  const dataObj = JSON.parse(window.localStorage.getItem('dataLangItems'))
  const langObj = getObjects(dataObj, 'url', finalPath)

  // Fallback solution - go to nextlang homepage
  if (!langObj[0] || !langObj[0].languageID) {
    window.location.href = theUrl + '/index.html'
  }

  const typic = getObjects(dataObj, 'languageID', langObj[0].languageID)
  // Fallback solution - go to nextlang homepage
  if (!typic[nextLang] && !typic[nextLang].url) {
    window.location.href = theUrl + '/index.html'
  }

  const theRealPath = typic[nextLang].url.replace('/en/', '/')
  window.location.href = theUrl + theRealPath + '.html'
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
