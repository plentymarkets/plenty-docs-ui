if (window.location.host !== 'developers.plentymarkets.com') {
  window.onload = function showSearchBarOnDesktop () {
    if (document.getElementById('searchbar') && document.getElementById('search-input')) {
      const searchBar = document.getElementById('searchbar')
      const searchText = document.getElementById('search-input')
      const mediaQuery = window.matchMedia('(min-width: 1024px)')

      if (mediaQuery.matches) {
        searchBar.classList.remove('d-none')
        searchText.focus()
      }
    }
    if (document.getElementById('facets-sidebar')) {
      const facetsSidebar = document.getElementById('facets-sidebar')
      const mediaQuery = window.matchMedia('(min-width:1024px)')

      if (mediaQuery.matches) {
        facetsSidebar.classList.remove('d-none')
      }
    }
  }
}
