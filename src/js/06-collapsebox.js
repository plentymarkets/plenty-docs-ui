; (function () {
  var colboxes = document.getElementsByClassName('collapseBox')

  for (var i = 0; i < colboxes.length; i++) {
    var colboxtitle = colboxes[i].getElementsByClassName('title')
    colboxtitle[i].onclick = function () {
      this.parentElement.classList.toggle('active')
    }
  }
})()
