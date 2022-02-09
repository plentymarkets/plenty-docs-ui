class ElasticSearch {
  constructor () {
    this.searchresults = ''
    this.setClient()
  }

  setOptions (current, lang) {
    this.options = {
      search_fields: { url_path_dir4: {}, body_content: {}, meta_keywords: {}, meta_description: {}, headings: {} },
      result_fields: { id: { raw: {} }, title: { raw: {} }, headings: { raw: {} }, url: { raw: {} } },
      page: { size: 20, current: current },
      query: 'url_path_dir1=' + lang
    }
  }

  setClient () {
    this.client = window.ElasticAppSearch.createClient({
      searchKey: 'search-j8q2jpghrg9e28z8rj6sqfg1',
      engineName: 'knowledge',
      endpointBase: 'https://plenty-docs-search.ent.eu-central-1.aws.cloud.es.io',
    })
  }

  getSuggestions (searchKey) {
    this.client.querySuggestion(searchKey, { query: searchKey, size: 10 })
      .then((resultList) => {
        this.searchresults = ''
        resultList.results.documents.forEach((result) => {
          this.searchresults += '<a href="search.html?query=' + encodeURIComponent(result.suggestion) + '">' + result.suggestion + '</a>'
        })
        if (this.searchresults) {
          document.getElementById('search-results').innerHTML = '<div id="the-results">' + this.searchresults + '</div>'
        } else {
          document.getElementById('search-results').innerHTML = ''
        }
      })
      .catch((error) => {
        console.log(`error: ${error}`)
      })
  }

  getResults (searchKey) {
    this.client
      .search(searchKey, this.options)
      .then((resultList) => {
        this.searchresults = ''
        this.createPagination(resultList.info.meta.page.current, resultList.info.meta.page.total_pages)
        document.getElementById('searchnores').innerHTML = resultList.info.meta.page.total_results
        resultList.results.forEach((result) => {
          this.searchresults += '<a class="the-search-result" href="' + result.data.url.raw + '"><span class="result-title">' + result.data.title.raw + '</span><span class="result-description">' + result.data.headings.raw + '</span><span class="result-url">' + result.data.url.raw + '</span></a>'
        })
        document.getElementById('search-page-results').innerHTML = this.searchresults
      })
      .catch((error) => {
        console.log(`error: ${error}`)
      })
  }

  createPagination (pageId, totalPages) {
    const urlResult = decodeURI(window.location.search.split('?query=')[1].split('&page=')[0])
    const newUrl = '?query=' + encodeURIComponent(urlResult)
    const previousPageNumber = pageId - 1
    const nextPageNumber = pageId + 1
    let thePages = ''
    if (pageId > 1) {
      thePages += '<a href="' + newUrl + '&page=' + previousPageNumber + '" class="previous"><i class="fa fa-angle-left"></i></a>'
      thePages += '<a href="' + newUrl + '&page=' + previousPageNumber + '">' + previousPageNumber + '</a>'
    }
    thePages += '<a href="' + newUrl + '&page=' + pageId + '" class="active">' + pageId + '</a>'
    if (pageId < totalPages) {
      thePages += '<a href="' + newUrl + '&page=' + nextPageNumber + '">' + nextPageNumber + '</a>'
      thePages += '<a href="' + newUrl + '&page=' + nextPageNumber + '" class="next"><i class="fa fa-angle-right"></i></a>'
    }
    document.getElementById('search-page-pagination').innerHTML = thePages
  }
}

(function () {
  $(document).ready(function () {
    let timeout = false
    const elasticSearch = new ElasticSearch()
    const searchPageResults = document.getElementById('search-page-results')
    const searchIcon = document.getElementById('search-icon')
    const searchBar = document.getElementById('searchbar')
    const searchText = document.getElementById('search-input')
    const currentLang = window.location.href.includes('/en-gb/') ? 'en-gb' : 'de-de'
    searchIcon.addEventListener('click', () => {
      if (searchBar.classList.contains('d-none')) {
        searchBar.classList.remove('d-none')
      } else {
        searchBar.classList.add('d-none')
      }
      if (document.getElementById('openSearch').classList.contains('d-none')) {
        document.getElementById('openSearch').classList.remove('d-none')
        document.getElementById('closeSearch').classList.add('d-none')
      } else {
        document.getElementById('openSearch').classList.add('d-none')
        document.getElementById('closeSearch').classList.remove('d-none')
      }
    })
    searchText.addEventListener('input', () => {
      if (timeout) {
        clearTimeout(timeout)
      }
      timeout = setTimeout(function () {
        elasticSearch.getSuggestions(searchText.value)
      }, 300)
    })

    if (searchPageResults) {
      const urlResult = window.location.search.split('?query=')[1]
      let urlPage = 1
      if (urlResult.includes('page=')) {
        urlPage = parseInt(urlResult.split('page=')[1].split('&')[0])
      }
      elasticSearch.setOptions(urlPage, currentLang)
      const startTime = window.performance.now()
      elasticSearch.getResults(urlResult)
      const endTime = window.performance.now()
      const timeDifference = (endTime - startTime).toFixed(2)
      document.getElementById('searchnotime').innerHTML = timeDifference
      document.getElementById('searche').innerHTML = decodeURI(urlResult.split('&')[0])
    }
  })
})()
