/* global MutationObserver */

class ElasticSearch {
  constructor () {
    this.searchresults = ''
  }

  setOptions (current, componentFilter, moduleFilter) {
    this.options = {
      search_fields: { url_path_dir4: {}, article_content: {}, meta_keywords: {}, meta_description: {}, headings: {} },
      result_fields: { id: { raw: {} }, headings: { raw: {} }, article_content: { raw: { size: 250 } }, url: { raw: {} } },
      facets: {
        url_path_dir2: { type: 'value' },
        url_path_dir4: { type: 'value' },
      },
      filters: {
        all: [
          { url_path_dir2: componentFilter },
          { url_path_dir4: moduleFilter },
        ],
      },
      page: { size: 20, current: current },
    }
  }

  setClient (engine) {
    this.client = window.ElasticAppSearch.createClient({
      searchKey: 'search-j8q2jpghrg9e28z8rj6sqfg1',
      engineName: engine,
      endpointBase: 'https://plenty-docs-search.ent.eu-central-1.aws.cloud.es.io',
    })
  }

  getSuggestions (searchKey) {
    const filterOptions = {
      query: searchKey,
      types: {
        documents: { fields: ['meta_keywords', 'headings'] },
      },
      size: 7,
    }
    this.client.querySuggestion(searchKey, filterOptions)
      .then((resultList) => {
        const slashCount = window.location.href.match(/\//g).length
        let searchHref = 'search.html?query='
        /*
          The default value for searchHref only works for the local environment and ROOT module.
          For all other modules, it's required to cut off the module name before appending the search results URL.
          All non-ROOT pages have 7 slashes in the URL.
        */
        if (slashCount === 7) {
          searchHref = window.location.href.split('/').slice(0, slashCount - 1).join('/') + '/search.html?query='
        }
        this.searchresults = ''
        resultList.results.documents.forEach((result) => {
          this.searchresults += '<a href=' + searchHref + encodeURIComponent(result.suggestion) + '">' + result.suggestion + '</a>'
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
        const currentLocation = window.location.pathname
        const locale = currentLocation.includes('en-gb') ? 'en-gb' : 'de-de'
        const componentFilter = this.options.filters.all[0].url_path_dir2
        const moduleFilter = this.options.filters.all[1].url_path_dir4
        let translationObject
        this.searchresults = ''
        this.componentFacets = ''
        this.moduleFacets = ''

        if (locale === 'de-de') {
          translationObject = JSON.parse(window.localStorage.getItem('localeDeDe'))
        } else {
          translationObject = JSON.parse(window.localStorage.getItem('localeEnGb'))
        }

        this.createPagination(resultList.info.meta.page.current, resultList.info.meta.page.total_pages)
        document.getElementById('searchnores').innerHTML = resultList.info.meta.page.total_results
        resultList.results.forEach((result) => {
          this.searchresults += '<a class="the-search-result" href="' + result.data.url.raw + '"><span class="result-title">' + result.data.headings.raw[0] + '</span><span class="result-description">' + result.data.article_content.raw + '...</span><span class="result-url">' + result.data.url.raw + '</span></a>'
        })
        document.getElementById('search-page-results').innerHTML = this.searchresults

        document.getElementById('facets-container').innerHTML = ''
        resultList.info.facets.url_path_dir2[0].data.forEach((component) => {
          const componentName = component.value
          const componentLabel = translationObject[componentName] ? translationObject[componentName] : component.value
          this.componentFacets +=
          `<li>
          <label for="facet_url_path_dir2${componentName}" class="sui-multi-checkbox-facet__option-label">
          <div class="sui-multi-checkbox-facet__option-input-wrapper">
          <input id="facet_url_path_dir2${componentName}" data-filter="url_path_dir2" data-value=${componentName} type="checkbox" class="sui-multi-checkbox-facet__checkbox">
          <span class="sui-multi-checkbox-facet__input-text">${componentLabel}</span></div>
          <span class="sui-multi-checkbox-facet__option-count">${component.count}</span></label></li>`
        })
        document.getElementById('facets-container').innerHTML += `<h3 data-i18n-key="components-title" class="sui-facet__title">
        ${translationObject.components_title}</h3><ul>${this.componentFacets}</ul>`

        resultList.info.facets.url_path_dir4[0].data.forEach((module) => {
          const moduleName = module.value
          const moduleLabel = translationObject[moduleName] ? translationObject[moduleName] : module.value
          this.moduleFacets +=
          `<li><label for="facet_url_path_dir4${moduleName}" class="sui-multi-checkbox-facet__option-label">
          <div class="sui-multi-checkbox-facet__option-input-wrapper">
          <input id="facet_url_path_dir4${moduleName}" data-filter="url_path_dir4" data-value=${moduleName} type="checkbox" class="sui-multi-checkbox-facet__checkbox">
          <span class="sui-multi-checkbox-facet__input-text">${moduleLabel}</span></div>
          <span class="sui-multi-checkbox-facet__option-count">${module.count}</span></label></li>`
        })
        document.getElementById('facets-container').innerHTML += `<h3 class="sui-facet__title">
        ${translationObject.modules_title}</h3><ul>${this.moduleFacets}</ul>`

        if (componentFilter !== undefined) {
          document.getElementById('facet_url_path_dir2' + componentFilter).checked = true
        }
        if (moduleFilter !== undefined) {
          document.getElementById('facet_url_path_dir4' + moduleFilter).checked = true
        }
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

function toggleSearchBar () {
  const searchBar = document.getElementById('searchbar')
  const searchText = document.getElementById('search-input')
  const mediaQuery = window.matchMedia('(min-width: 1024px)')

  if (searchBar.classList.contains('d-none')) {
    searchBar.classList.remove('d-none')
    searchText.focus()
    if (!mediaQuery.matches) {
      document.body.style.position = 'fixed'
      document.body.style.top = `-${window.scrollY}px`
    }
  } else {
    searchBar.classList.add('d-none')
    searchText.blur()
    if (!mediaQuery.matches) {
      document.body.style.position = ''
      document.body.style.top = ''
    }
  }
}

function toggleFilterContainer () {
  const facetsSidebar = document.getElementById('facets-sidebar')
  const mediaQuery = window.matchMedia('(min-width: 1024px)')

  if (facetsSidebar.classList.contains('d-none')) {
    facetsSidebar.classList.remove('d-none')
    if (!mediaQuery.matches) {
      document.body.style.position = 'fixed'
      document.body.style.top = `-${window.scrollY}px`
    }
  } else {
    facetsSidebar.classList.add('d-none')
    if (!mediaQuery.matches) {
      document.body.style.position = ''
      document.body.style.top = ''
    }
  }
}

(function () {
  $(document).ready(function () {
    if (window.location.host !== 'developers.plentymarkets.com') {
      let timeout = false
      const elasticSearch = new ElasticSearch()
      const engine = window.location.href.includes('/en-gb/') ? 'knowledge-en-gb' : 'knowledge-de-de'
      elasticSearch.setClient(engine)
      if (document.getElementById('toggle-search') && document.getElementById('search-input')) {
        const searchIcon = document.getElementById('toggle-search')
        const searchText = document.getElementById('search-input')

        document.addEventListener('keydown', (e) => {
          if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
            toggleSearchBar()
          }
        })
        searchIcon.addEventListener('click', () => {
          toggleSearchBar()
        })
        searchText.addEventListener('input', () => {
          if (timeout) {
            clearTimeout(timeout)
          }
          timeout = setTimeout(function () {
            elasticSearch.getSuggestions(searchText.value)
          }, 300)
        })
      }

      if (document.getElementById('toggle-filter') && document.getElementById('facets-sidebar')) {
        const filterIcon = document.getElementById('toggle-filter')

        filterIcon.addEventListener('click', () => {
          toggleFilterContainer()
        })
      }

      if (document.getElementById('search-page-results')) {
        const urlResult = window.location.search.split('?query=')[1]
        const startTime = window.performance.now()
        const endTime = window.performance.now()
        const timeDifference = (endTime - startTime).toFixed(2)
        const facetsContainer = document.getElementById('facets-container')
        const observerConfig = { childList: true }
        let componentFilter
        let moduleFilter
        let urlPage = 1
        if (urlResult.includes('page=')) {
          urlPage = parseInt(urlResult.split('page=')[1].split('&')[0])
        }
        elasticSearch.setOptions(urlPage)
        elasticSearch.getResults(urlResult)
        document.getElementById('searchnotime').innerHTML = timeDifference
        document.getElementById('searche').innerHTML = decodeURI(urlResult.split('&')[0])

        const callback = function (mutationsList, observer) {
          const facets = document.querySelectorAll('.sui-multi-checkbox-facet input[type=checkbox]')

          function toggleFilter (event) {
            if (document.getElementById(event.target.id).checked === true) {
              if (event.target.dataset.filter === 'url_path_dir2') {
                componentFilter = event.target.dataset.value
              }
              if (event.target.dataset.filter === 'url_path_dir4') {
                moduleFilter = event.target.dataset.value
              }
            } else {
              if (event.target.dataset.filter === 'url_path_dir2') {
                componentFilter = undefined
              }
              if (event.target.dataset.filter === 'url_path_dir4') {
                moduleFilter = undefined
              }
            }
            elasticSearch.setOptions(1, componentFilter, moduleFilter)
            elasticSearch.getResults(urlResult)
          }

          for (var i = 0; i < facets.length; i++) {
            facets[i].addEventListener('change', toggleFilter)
          }
        }
        const observer = new MutationObserver(callback)

        observer.observe(facetsContainer, observerConfig)
      }
    }
  })
})()
