const currentPage = document.getElementsByClassName('is-current-page')
let childPagesList = document.createElement('div')
if (currentPage[0].getElementsByClassName('nav-list')[0] && document.getElementById('child-pages-list')) {
  childPagesList = currentPage[0].getElementsByClassName('nav-list')[0].cloneNode(true)
  document.getElementById('child-pages-list').appendChild(childPagesList)
}
