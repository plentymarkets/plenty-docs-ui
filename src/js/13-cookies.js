const name = 'plenty-cookies'

class Cookies {
  constructor () {
    this.addListeners()
    if (document.cookie.indexOf(name) === -1) {
      this.toggleCookies()
    }
    this.setDefaultSettings()
  }

  addListeners () {
    const acceptAllButton = document.getElementsByClassName('cookie-accept')
    const acceptSelectedButton = document.getElementsByClassName('cookie-accept-selection')
    const declineButton = document.getElementsByClassName('cookie-deny')
    const showfurtherSettings = document.getElementById('show-cookie-further-settings')
    const hidefurtherSettings = document.getElementById('hide-cookie-further-settings')

    acceptAllButton[0].addEventListener('click', () => { this.setCookie(true, true, true, true) })
    acceptSelectedButton[0].addEventListener('click', () => {
      this.setCookie(this.consent, this.statistics, this.external, this.functional)
    })
    declineButton[0].addEventListener('click', () => { this.setCookie(false, false, false, false) })
    showfurtherSettings.addEventListener('click', () => { this.toggleExtraSettings('show') })
    hidefurtherSettings.addEventListener('click', () => { this.toggleExtraSettings('hide') })

    document.querySelectorAll('.cookie-settings').forEach((item) => {
      item.addEventListener('click', (event) => {
        this[item.getAttribute('source')] = !this[item.getAttribute('source')]
      })
    })
  }

  toggleCookies (action) {
    let display = 'block'
    if (action === 'hide') {
      display = 'none'
    }
    document.getElementsByClassName('cookie-bar')[0].style.display = display
  }

  toggleExtraSettings (action) {
    let cookieSettingsDisplay = 'none'
    let cookieFurtherSettingsDisplay = 'block'
    if (action === 'hide') {
      cookieSettingsDisplay = 'flex'
      cookieFurtherSettingsDisplay = 'none'
    }
    document.getElementById('cookie-further-settings').style.display = cookieFurtherSettingsDisplay
    document.getElementById('cookie-settings').style.display = cookieSettingsDisplay
  }

  setCookie (consent, statistics, external, functional) {
    this.consent = consent
    this.statistics = statistics
    this.external = external
    this.functional = functional
    document.cookie = name + '= ' + this.createCookie() + '; Secure'
    this.toggleCookies('hide')
    this.setDefaultSettings()
  }

  createCookie () {
    const cookie = {}
    cookie.necessary = {}
    cookie.tracking = {}
    cookie.media = {}
    cookie.convenience = {}
    cookie.necessary.consent = this.consent
    cookie.necessary.session = this.consent
    cookie.necessary.csrf = this.consent
    cookie.necessary.elasticSearch = this.consent
    cookie.tracking.googleAnalytics = this.statistics
    cookie.media.youtube = this.external
    cookie.media.vimeo = this.external
    cookie.convenience.languageDetection = this.functional
    return JSON.stringify(cookie)
  }

  setDefaultSettings () {
    this.consent = true
    this.statistics = false
    this.external = false
    this.functional = false
  }
}

(function () {
  window.addEventListener('DOMContentLoaded', (event) => {
    // eslint-disable-next-line no-new
    new Cookies()
  })
})()
