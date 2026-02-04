const articleBody = document.getElementById('article-body')
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
    articleBody.classList.add('mobile-no-scroll')
    searchBar.classList.remove('d-none')
    searchText.focus()
  } else {
    articleBody.classList.remove('mobile-no-scroll')
    searchBar.classList.add('d-none')
    searchText.blur()
  }
}

function toggleFilterContainer () {
  if (facetsSidebar.classList.contains('d-none')) {
    articleBody.classList.add('mobile-no-scroll')
    facetsSidebar.classList.remove('d-none')
  } else {
    articleBody.classList.remove('mobile-no-scroll')
    facetsSidebar.classList.add('d-none')
  }
}
