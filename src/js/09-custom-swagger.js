;(function () {
  function createSwaggerNav() {
    const $container = $('nav.nav-menu > ul.nav-list')
    const $headlines = $('h4 > a.nostyle')

    createSidebar($container, $headlines)

    function createSidebar(container, headlines) {
      headlines.each(function () {
        container.append(createListItem(this))
      })
    }

    function createListItem($target) {
      const targetText = $target.innerText

      const $item = $('<li class="nav-item" data-depth="0"></li>')
      $item.append('<a href="#operations-tag-' + targetText + '">' + targetText + '</a>')

      $item.on('click', function (e) {
        e.stopPropagation()
        e.preventDefault()

        const $target = $(this.firstChild.hash)
        const headerHeight = $('nav.navbar').height() + $target.height()

        $('html, body')
          .stop()
          .animate(
            {
              scrollTop: $target.offset().top - headerHeight,
            },
            300,
            'swing',
            function () {
              $target.addClass('blink')
              setTimeout(function () {
                $target.removeClass('blink')
              }, 500)
            }
          )
        window.location.hash = '#operations-tag-' + targetText
      })

      return $item
    }
  }
  window.createSwaggerNav = createSwaggerNav
})()
