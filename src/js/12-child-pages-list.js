const currentPage = document.getElementsByClassName('is-current-page')
let childPagesList = ''
childPagesList = currentPage[0].getElementsByClassName('nav-list')[0]
document.getElementById('child-pages-list').appendChild(childPagesList)
