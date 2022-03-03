const currentPage = document.getElementsByClassName('is-current-page')
let childPagesList = document.createElement('div')
if (currentPage[0].getElementsByClassName('nav-list').length > 0) {
  childPagesList = currentPage[0].getElementsByClassName('nav-list')[0].cloneNode(true)
  if (document.getElementById('child-pages-list')) {
    document.getElementById('child-pages-list').appendChild(childPagesList)
  }
}
