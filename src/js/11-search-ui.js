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

function toggleSearchBar () {
    const searchBar = document.getElementById('searchbar')
    const searchText = document.getElementById('search-input')
    const mediaQuery = window.matchMedia('(min-width: 1024px)')

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
    const facetsSidebar = document.getElementById('facets-sidebar')
    const mediaQuery = window.matchMedia('(min-width: 1024px)')

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
