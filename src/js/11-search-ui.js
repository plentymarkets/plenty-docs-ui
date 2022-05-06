const searchBar = document.getElementById('searchbar')
const searchText = document.getElementById('search-input')
const searchIcon = document.getElementById('toggle-search')
const facetsIcon = document.getElementById('toggle-filter')
const facetsSidebar = document.getElementById('facets-sidebar')
const mediaQuery = window.matchMedia('(min-width: 1024px)')

$(document).ready(function () {
  if (window.location.host !== 'developers.plentymarkets.com') {
    if (searchBar && searchText && !mediaQuery.matches) {
      searchBar.classList.add('d-none')
      searchText.focus()
    }
    if (facetsSidebar && !mediaQuery.matches) {
      facetsSidebar.classList.add('d-none')
    }

    if (searchIcon && searchText) {
      document.addEventListener('keydown', (e) => {
        if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
          toggleSearchBar()
        }
      })
      searchIcon.addEventListener('click', () => {
        toggleSearchBar()
      })
    }

    if (facetsIcon && facetsSidebar) {
      facetsIcon.addEventListener('click', () => {
        toggleFilterContainer()
      })
    }
  }
})

function toggleSearchBar () {
  if (searchBar.classList.contains('d-none')) {
    searchBar.classList.remove('d-none')
    searchText.focus()
    if (!mediaQuery.matches) {
      document.body.style.position = 'fixed'
      document.body.style.top = `-${window.scrollY}px`
    }
  } else {
    searchBar.classList.add('d-none')
    searchText.blur()
    if (!mediaQuery.matches) {
      document.body.style.position = ''
      document.body.style.top = ''
    }
  }
}

function toggleFilterContainer () {
  if (facetsSidebar.classList.contains('d-none')) {
    facetsSidebar.classList.remove('d-none')
    if (!mediaQuery.matches) {
      document.body.style.position = 'fixed'
      document.body.style.top = `-${window.scrollY}px`
    }
  } else {
    facetsSidebar.classList.add('d-none')
    if (!mediaQuery.matches) {
      document.body.style.position = ''
      document.body.style.top = ''
    }
  }
}
