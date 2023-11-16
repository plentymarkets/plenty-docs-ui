;(function () {
  'use strict'

  const article = document.querySelector('article.doc')

  function decodeFragment(hash) {
    return hash && (~hash.indexOf('%') ? decodeURIComponent(hash) : hash).slice(1)
  }

  function computePosition(el, sum) {
    if (article.contains(el)) {
      return computePosition(el.offsetParent, el.offsetTop + sum)
    } else {
      return sum
    }
  }

  function jumpToAnchor(e) {
    if (e) {
      window.location.hash = '#' + this.id
      e.preventDefault()
    }
    let diff = 108
    const navs = document.getElementsByTagName('nav')
    if (navs !== null && navs.length !== 0 && navs[0] != null) {
      diff = navs[0].clientHeight
    }
    window.scrollTo(0, computePosition(this, 0) - diff)
  }

  window.addEventListener('load', function jumpOnLoad(e) {
    let fragment, target
    if ((fragment = decodeFragment(window.location.hash)) && (target = document.getElementById(fragment))) {
      jumpToAnchor.bind(target)()
      setTimeout(jumpToAnchor.bind(target), 0)
    }
    window.removeEventListener('load', jumpOnLoad)
  })

  Array.prototype.slice.call(document.querySelectorAll('a[href^="#"]')).forEach(function (el) {
    let fragment, target
    if ((fragment = decodeFragment(el.hash)) && (target = document.getElementById(fragment))) {
      el.addEventListener('click', jumpToAnchor.bind(target))
    }
  })
})()
