const currentPage = document.getElementsByClassName('is-current-page')
let childPagesList = document.createElement('div')
childPagesList = currentPage[0].getElementsByClassName('nav-list')[0]
if (document.getElementById('child-pages-list')){
    document.getElementById('child-pages-list').appendChild(childPagesList)
}
