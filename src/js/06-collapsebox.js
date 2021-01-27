; (function () {
  var colbox = document.getElementsByClassName('collapsebox')

  colbox.forEach((collapsible) => {
    collapsible.onclick = function () {
      this.classList.toggle('active')
    }
  })
})()
