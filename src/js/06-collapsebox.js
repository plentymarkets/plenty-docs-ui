; (function () {
  var colboxes = document.getElementsByClassName('collapsebox')

  for (var i = 0; i < colboxes.length; i++) {
    colboxes[i].onclick = function () {
      this.classList.toggle('active')
    }
  }
})()
