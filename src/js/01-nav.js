;(function () {
  'use strict'

  // not needed on the homepage
  if (document.querySelector('body.homepage')) return

  const SECT_CLASS_RX = /^sect(\d)$/

  const navContainer = document.querySelector('.nav-container')
  const navToggle = document.querySelector('.nav-toggle')

  if (navToggle) navToggle.addEventListener('click', showNav)
  if (navContainer) navContainer.addEventListener('click', concealEvent)

  const menuPanel = navContainer.querySelector('[data-panel=menu]') || null
  if (!menuPanel) return
  const nav = navContainer.querySelector('.nav')

  let currentPageItem = menuPanel.querySelector('.is-current-page')
  const originalPageItem = currentPageItem
  if (currentPageItem) {
    activateCurrentPath(currentPageItem)
    scrollItemToMidpoint(menuPanel, currentPageItem.querySelector('.nav-link'))
  } else {
    menuPanel.scrollTop = 0
  }

  find(menuPanel, '.nav-item-toggle').forEach(function (btn) {
    const li = btn.parentElement
    btn.addEventListener('click', toggleActive.bind(li))
    const navItemSpan = findNextElement(btn, '.nav-text')
    if (navItemSpan) {
      navItemSpan.style.cursor = 'pointer'
      navItemSpan.addEventListener('click', toggleActive.bind(li))
    }
  })

  nav.querySelector('.context').addEventListener('click', function () {
    const currentPanel = nav.querySelector('.is-active[data-panel]')
    const activatePanel = currentPanel.dataset.panel === 'menu' ? 'explore' : 'menu'
    currentPanel.classList.toggle('is-active')
    nav.querySelector('[data-panel=' + activatePanel + ']').classList.toggle('is-active')
  })

  // NOTE prevent text from being selected by double click
  menuPanel.addEventListener('mousedown', function (e) {
    if (e.detail > 1) e.preventDefault()
  })

  function onHashChange () {
    let navLink
    let hash = window.location.hash
    if (hash) {
      if (hash.indexOf('%')) hash = decodeURIComponent(hash)
      navLink = menuPanel.querySelector('.nav-link[href="' + hash + '"]')
      if (!navLink) {
        const targetNode = document.getElementById(hash.slice(1))
        if (targetNode) {
          let current = targetNode
          const ceiling = document.querySelector('article.doc')
          while ((current = current.parentNode) && current !== ceiling) {
            let id = current.id
            // NOTE: look for section heading
            if (!id && (id = current.className.match(SECT_CLASS_RX))) id = (current.firstElementChild || {}).id
            if (id && (navLink = menuPanel.querySelector('.nav-link[href="#' + id + '"]'))) break
          }
        }
      }
    }
    let navItem
    if (navLink) {
      navItem = navLink.parentNode
    } else if (originalPageItem) {
      navLink = (navItem = originalPageItem).querySelector('.nav-link')
    } else {
      return
    }
    if (navItem === currentPageItem) return
    find(menuPanel, '.nav-item.is-active').forEach(function (el) {
      el.classList.remove('is-active', 'is-current-path', 'is-current-page')
    })
    navItem.classList.add('is-current-page')
    currentPageItem = navItem
    activateCurrentPath(navItem)
    scrollItemToMidpoint(menuPanel, navLink)
  }

  if (menuPanel.querySelector('.nav-link[href^="#"]')) {
    if (window.location.hash) onHashChange()
    window.addEventListener('hashchange', onHashChange)
  }

  function activateCurrentPath (navItem) {
    let ancestorClasses
    let ancestor = navItem.parentNode
    while (!(ancestorClasses = ancestor.classList).contains('nav-menu')) {
      if (ancestor.tagName === 'LI' && ancestorClasses.contains('nav-item')) {
        ancestorClasses.add('is-active', 'is-current-path')
      }
      ancestor = ancestor.parentNode
    }
    navItem.classList.add('is-active')
  }

  function toggleActive () {
    this.classList.toggle('is-active')
  }

  function showNav (e) {
    if (navToggle.classList.contains('is-active')) return hideNav(e)
    const html = document.documentElement
    html.classList.add('is-clipped--nav')
    navToggle.classList.add('is-active')
    navContainer.classList.add('is-active')
    html.addEventListener('click', hideNav)
    concealEvent(e)
  }

  function hideNav (e) {
    const html = document.documentElement
    html.classList.remove('is-clipped--nav')
    navToggle.classList.remove('is-active')
    navContainer.classList.remove('is-active')
    html.removeEventListener('click', hideNav)
    concealEvent(e)
  }

  // NOTE don't let event get picked up by window click listener
  function concealEvent (e) {
    e.stopPropagation()
  }

  function scrollItemToMidpoint (panel, el) {
    const rect = panel.getBoundingClientRect()
    let effectiveHeight = rect.height
    const navStyle = window.getComputedStyle(nav)
    if (navStyle.position === 'sticky') effectiveHeight -= rect.top - parseFloat(navStyle.top)
    panel.scrollTop = Math.max(0, (el.getBoundingClientRect().height - effectiveHeight) * 0.5 + el.offsetTop)
  }

  function find (from, selector) {
    return [].slice.call(from.querySelectorAll(selector))
  }

  function findNextElement (from, selector) {
    const el = from.nextElementSibling
    if (!el) return
    return selector ? el[el.matches ? 'matches' : 'msMatchesSelector'](selector) && el : el
  }
})()
