class EasterEggHandler {
  constructor () {
    this.registerListener()
    this.enabled = false
    this.copyrightClickCounter = 0
  }

  registerListener () {
    $('.footer-menu small').on('click', () => {
      if (this.enabled) {
        return
      }
      this.copyrightClickCounter++
      if (this.copyrightClickCounter >= 3) {
        this.enableEasterEgg()
      }
    })
  }

  enableEasterEgg () {
    this.enabled = true
    $('body').css('transition', '1s all')
    $('.menu-wrapper').append('<a class="menu-item easter-egg-button" href="javascript:void(0)">Show backend</a>')
    $('.easter-egg-button').on('click', () => {
      $('body').toggleClass('backend')
    })
  }
}

(function () {
  $(document).ready(function () {
    // eslint-disable-next-line
    new EasterEggHandler()
  })
})()
