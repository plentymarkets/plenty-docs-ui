/* global MutationObserver, translations */

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
        const componentsTitle = translateKey(locale, 'components_title')
        const componentFilter = this.options.filters.all[0].url_path_dir2
        const modulesTitle = translateKey(locale, 'modules_title')
        const moduleFilter = this.options.filters.all[1].url_path_dir4
        const resultsLabel = translateKey(locale, 'results_label')
        const generalLabel = 'general'
        this.searchresults = ''
        this.componentFacets = ''
        this.moduleFacets = ''

        this.createPagination(resultList.info.meta.page.current, resultList.info.meta.page.total_pages)
        document.getElementById('searchnores').innerHTML = `${resultList.info.meta.page.total_results} ${resultsLabel}`
        resultList.results.forEach((result) => {
          this.searchresults += '<a class="the-search-result" href="' + result.data.url.raw + '"><span class="result-title">' + result.data.headings.raw[0] + '</span><span class="result-description">' + result.data.article_content.raw + '...</span><span class="result-url">' + result.data.url.raw + '</span></a>'
        })
        document.getElementById('search-page-results').innerHTML = this.searchresults

        document.getElementById('facets-container').innerHTML = ''
        resultList.info.facets.url_path_dir2[0].data.forEach((component) => {
          const componentName = component.value
          const componentLabel = componentName ? translateKey(locale, componentName) : translateKey(locale, generalLabel)
          this.componentFacets +=
          `<li>
          <label for="facet_url_path_dir2${componentName}" class="sui-multi-checkbox-facet__option-label">
          <div class="sui-multi-checkbox-facet__option-input-wrapper">
          <input id="facet_url_path_dir2${componentName}" data-filter="url_path_dir2" data-value="${componentName}" type="checkbox" class="sui-multi-checkbox-facet__checkbox">
          <span class="sui-multi-checkbox-facet__input-text">${componentLabel}</span></div>
          <span class="sui-multi-checkbox-facet__option-count">${component.count}</span></label></li>`
        })
        document.getElementById('facets-container').innerHTML += `<h3 data-i18n-key="components-title" class="sui-facet__title">
        ${componentsTitle}</h3><ul>${this.componentFacets}</ul>`

        resultList.info.facets.url_path_dir4[0].data.forEach((module) => {
          const moduleName = module.value
          const moduleLabel = moduleName ? translateKey(locale, moduleName) : translateKey(locale, generalLabel)
          this.moduleFacets +=
          `<li><label for="facet_url_path_dir4${moduleName}" class="sui-multi-checkbox-facet__option-label">
          <div class="sui-multi-checkbox-facet__option-input-wrapper">
          <input id="facet_url_path_dir4${moduleName}" data-filter="url_path_dir4" data-value="${moduleName}" type="checkbox" class="sui-multi-checkbox-facet__checkbox">
          <span class="sui-multi-checkbox-facet__input-text">${moduleLabel}</span></div>
          <span class="sui-multi-checkbox-facet__option-count">${module.count}</span></label></li>`
        })
        document.getElementById('facets-container').innerHTML += `<h3 class="sui-facet__title">
        ${modulesTitle}</h3><ul>${this.moduleFacets}</ul>`

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

function translateKey (locale, key) {
  const translation = translations[locale][key] ? translations[locale][key] : key
  return translation
}

(function () {
  $(document).ready(function () {
    if (window.location.host !== 'developers.plentymarkets.com') {
      const searchIcon = document.getElementById('toggle-search')
      const searchText = document.getElementById('search-input')
      const elasticSearch = new ElasticSearch()
      const engine = window.location.href.includes('/en-gb/') ? 'knowledge-en-gb' : 'knowledge-de-de'
      let timeout = false
      elasticSearch.setClient(engine)
      if (searchIcon && searchText) {
        searchText.addEventListener('input', () => {
          if (timeout) {
            clearTimeout(timeout)
          }
          timeout = setTimeout(function () {
            elasticSearch.getSuggestions(searchText.value)
          }, 300)
        })
      }

      if (document.getElementById('search-page-results')) {
        const urlResult = window.location.search.split('?query=')[1]
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
