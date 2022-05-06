function toggleFacetsOnResize () {
  const facetsSidebar = document.getElementById('facets-sidebar')
  const mediaQuery = window.matchMedia('(min-width: 1024px)')

  if (!mediaQuery.matches) {
    facetsSidebar.classList.add('d-none')
  } else {
    facetsSidebar.classList.remove('d-none')
  }
  document.body.style.position = ''
  document.body.style.top = ''
}

window.addEventListener('resize', toggleFacetsOnResize)
