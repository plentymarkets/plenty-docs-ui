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
      this.setCookie(this.consent, this.statistics.googleAnalytics, this.media.youtube, this.media.vimeo, this.functional.preferredLanguage)
    })
    declineButton[0].addEventListener('click', () => { this.setCookie(false, false, false, false) })
    showfurtherSettings.addEventListener('click', () => { this.toggleExtraSettings('show') })
    hidefurtherSettings.addEventListener('click', () => { this.toggleExtraSettings('hide') })

    document.querySelectorAll('.cookie-settings').forEach((item) => {
      item.addEventListener('click', (event) => {
        if (typeof this[item.getAttribute('source')] === 'object' && this[item.getAttribute('source')] !== null) {
          if (item.getAttribute('target') !== null) {
            this[item.getAttribute('source')][item.getAttribute('target')] = !this[item.getAttribute('source')][item.getAttribute('target')]

            let parentCheck = true
            Object.keys(this[item.getAttribute('source')]).forEach((v) => {
              if (!this[item.getAttribute('source')][v]) {
                parentCheck = false
              }
            })

            document.querySelectorAll('.cookie-settings[source="' + item.getAttribute('source') + '"]').forEach((v) => {
              if (v !== item && v.getAttribute('target') === null) {
                v.checked = parentCheck
              }
            })
            return
          }

          Object.keys(this[item.getAttribute('source')]).forEach((v) => {
            this[item.getAttribute('source')][v] = item.checked
          })
          document.querySelectorAll('.cookie-settings[source="' + item.getAttribute('source') + '"]').forEach((v) => {
            v.checked = item.checked
          })
          document.querySelectorAll('.cookie-settings[source="' + item.getAttribute('source') + '"][target="' + item.getAttribute('target') + '"]').forEach((v) => {
            v.checked = item.checked
          })
        }
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

  setCookie (consent, googleAnalytics, youtube, vimeo, preferredLanguage) {
    this.consent = consent
    this.statistics.googleAnalytics = googleAnalytics
    this.media.youtube = youtube
    this.media.vimeo = vimeo
    this.functional.preferredLanguage = preferredLanguage
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
    cookie.tracking.googleAnalytics = this.statistics.googleAnalytics
    cookie.media.youtube = this.media.youtube
    cookie.media.vimeo = this.media.vimeo
    cookie.convenience.languageDetection = this.functional.preferredLanguage
    return JSON.stringify(cookie)
  }

  setDefaultSettings () {
    this.consent = true
    this.statistics = {}
    this.statistics.googleAnalytics = false
    this.media = {}
    this.media.youtube = false
    this.media.vimeo = false
    this.functional = {}
    this.functional.preferredLanguage = false
  }
}

(function () {
  window.addEventListener('DOMContentLoaded', (event) => {
    // eslint-disable-next-line no-new
    new Cookies()
  })
})()
