function toggleSearchBarOnResize () {
  const searchBar = document.getElementById('searchbar')
  const mediaQuery = window.matchMedia('(min-width: 1024px)')

  if (!mediaQuery.matches) {
    searchBar.classList.add('d-none')
  } else {
    searchBar.classList.remove('d-none')
  }
}

window.addEventListener('resize', toggleSearchBarOnResize)
