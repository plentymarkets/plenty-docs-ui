$.getJSON('../../../_/lang/de-de.json')
  .done((data) => {
    window.localStorage.setItem('localeDeDe', JSON.stringify(data))
  })

$.getJSON('../../../_/lang/en-gb.json')
  .done((data) => {
    window.localStorage.setItem('localeEnGb', JSON.stringify(data))
  })
