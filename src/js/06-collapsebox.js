;(function () {
  const colboxes = document.getElementsByClassName('collapseBox')

  for (let i = 0; i < colboxes.length; i++) {
    const colboxtitle = colboxes[i].getElementsByClassName('title')
    colboxtitle[0].onclick = function () {
      this.parentElement.classList.toggle('active')
    }
  }
})()
