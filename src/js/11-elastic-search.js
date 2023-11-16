/* global Handlebars, MutationObserver, translations */

class ElasticSearch {
  constructor() {
    this.searchresults = ''
  }

  setOptions(current, componentFilter, moduleFilter) {
    this.options = {
      result_fields: {
        id: { raw: {} },
        headings: { raw: {} },
        article_content: { raw: { size: 250 } },
        url: { raw: {} },
      },
      facets: {
        url_path_dir2: { type: 'value' },
        url_path_dir4: { type: 'value' },
      },
      filters: {
        all: [{ url_path_dir2: componentFilter }, { url_path_dir4: moduleFilter }],
      },
      page: { size: 20, current },
    }
  }

  setClient(engine) {
    this.client = window.ElasticAppSearch.createClient({
      searchKey: 'search-j8q2jpghrg9e28z8rj6sqfg1',
      engineName: engine,
      endpointBase: 'https://plenty-docs-search-8.ent.eu-central-1.aws.cloud.es.io',
    })
  }

  getSuggestions(searchKey) {
    const filterOptions = {
      query: searchKey,
      types: {
        documents: { fields: ['meta_keywords', 'headings'] },
      },
      size: 7,
    }
    this.client
      .querySuggestion(searchKey, filterOptions)
      .then((resultList) => {
        const slashCount = window.location.href.match(/\//g).length
        let searchHref = 'search.html?query='
        /*
          The default value for searchHref only works for the local environment and ROOT module.
          For all other modules, it's required to cut off the module name before appending the search results URL.
          All non-ROOT pages have 7 slashes in the URL.
        */
        if (slashCount === 7) {
          searchHref =
            window.location.href
              .split('/')
              .slice(0, slashCount - 1)
              .join('/') + '/search.html?query='
        }
        this.searchresults = ''
        resultList.results.documents.forEach((result) => {
          const resultSuggestion = result.suggestion
          const resultSuggestionUri = encodeURIComponent(result.suggestion)
          this.searchresults += '<a href=' + searchHref + resultSuggestionUri + '">' + resultSuggestion + '</a>'
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

  getResults(searchKey) {
    this.client
      .search(searchKey, this.options)
      .then((resultList) => {
        const currentLocation = window.location.pathname
        const locale = currentLocation.includes('en-gb') ? 'en-gb' : 'de-de'
        const generalLabel = 'general'
        const searchQuery = decodeQueryParam(window.location.search.split('?query=')[1].split('&page=')[0])
        const searchQueryLabel = translateKey(locale, 'search_query_label')
        const searchResultsTemplateHtml = document.getElementById('search-page-template').innerHTML
        const searchFacetsTemplateHtml = document.getElementById('search-facets-template').innerHTML
        const searchPage = document.getElementById('search-page')
        const searchResultsFacets = document.getElementById('facets-container')
        const resultsLabel = translateKey(locale, 'results_label')
        const componentsTitle = translateKey(locale, 'components_title')
        const modulesTitle = translateKey(locale, 'modules_title')
        const componentFilterOptions = this.options.filters.all[0].url_path_dir2
        const moduleFilterOptions = this.options.filters.all[1].url_path_dir4
        const componentFilter = resultList.info.facets.url_path_dir2[0].data
        const moduleFilter = resultList.info.facets.url_path_dir4[0].data
        const pagesTotal = resultList.info.meta.page.total_pages
        const pageCurrent = resultList.info.meta.page.current
        const pageNext = pageCurrent < pagesTotal ? pageCurrent + 1 : ''
        const pagePrevious = pageCurrent > 1 ? pageCurrent - 1 : ''

        searchPage.innerHTML = Handlebars.compile(searchResultsTemplateHtml)({
          pageCurrent,
          pageNext,
          pagePrevious,
          results: resultList.rawResults,
          resultsLabel,
          searchQuery,
          searchQueryLabel,
          totalResults: resultList.info.meta.page.total_results,
        })

        /*
          The facet values Elasticsearch returns aren't necessarily well-suited for displaying.
          Occasionally there are problems with capitalisation or empty strings in case of the ROOT module.
          The following methods enrich the facets results with appropriate labels.
        */

        componentFilter.forEach((facet) => {
          const value = facet.value
          facet.label = value ? translateKey(locale, value) : translateKey(locale, generalLabel)
        })

        moduleFilter.forEach((facet) => {
          const value = facet.value
          facet.label = value ? translateKey(locale, value) : translateKey(locale, generalLabel)
        })

        searchResultsFacets.innerHTML = Handlebars.compile(searchFacetsTemplateHtml)({
          componentsTitle,
          components: componentFilter,
          modulesTitle,
          modules: moduleFilter,
        })

        if (componentFilterOptions) {
          document.getElementById('facet_url_path_dir2' + componentFilterOptions).checked = true
        }

        if (moduleFilterOptions) {
          document.getElementById('facet_url_path_dir4' + moduleFilterOptions).checked = true
        }
      })
      .catch((error) => {
        console.log(`error: ${error}`)
      })
  }
}

function translateKey(locale, key) {
  const translation = translations[locale][key] ? translations[locale][key] : key
  return translation
}

function decodeQueryParam(p) {
  return decodeURIComponent(p.replace(/\+/g, ' '))
}

;(function () {
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

      if (document.getElementById('search-page')) {
        const facetsContainer = document.getElementById('facets-container')
        const observerConfig = { childList: true }
        let componentFilter
        let moduleFilter
        let urlResult = decodeQueryParam(window.location.search.split('?query=')[1])
        let urlPage = 1
        if (urlResult.includes('page=')) {
          urlPage = parseInt(urlResult.split('page=')[1].split('&')[0])
          urlResult = urlResult.split('page=')[0].split('&')[0]
        }
        elasticSearch.setOptions(urlPage)
        elasticSearch.getResults(urlResult)
        document.getElementById('searche').innerHTML = decodeQueryParam(urlResult.split('&')[0])

        const callback = function (mutationsList, observer) {
          const facets = document.querySelectorAll('.sui-multi-checkbox-facet input[type=checkbox]')

          function toggleFilter(event) {
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

          for (let i = 0; i < facets.length; i++) {
            facets[i].addEventListener('change', toggleFilter)
          }
        }
        const observer = new MutationObserver(callback)

        observer.observe(facetsContainer, observerConfig)
      }
    }
  })
})()
