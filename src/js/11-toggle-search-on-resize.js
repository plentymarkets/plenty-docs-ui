function toggleSearchBarOnResize() {
  const articleBody = document.getElementById('article-body')
  const searchBar = document.getElementById('searchbar')
  const mediaQuery = window.matchMedia('(min-width: 1024px)')

  if (searchBar && !mediaQuery.matches) {
    searchBar.classList.add('d-none')
  } else {
    searchBar.classList.remove('d-none')
  }
  articleBody.classList.remove('mobile-no-scroll')
}

window.addEventListener('resize', toggleSearchBarOnResize)
