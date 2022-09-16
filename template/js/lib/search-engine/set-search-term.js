import * as merge from 'lodash.merge'
import query from '@ecomplus/search-engine/src/lib/dsl'

export default (self, term) => {
  const arr = (term || '').split(' ')
  const changeWord = (arr) => { 
    if (arr.length > 1) {
      const newArr = arr.map(word => {
        const lower = word.toLowerCase()
        switch (lower) {
          case 'cortador':
          case 'cortadore':
            return 'corta'
          case 'formas':
            return 'forma'
          case 'bicos':
            return 'bico'
          case 'açucar':
            return 'açúcar'
          case 'chocolates':
            return 'chocol'
          case 'termômetro':
            return 'termometro'
          case 'espátula':
            return 'espatula'
          case 'folha chumbo':
            return 'papel chumbo'
          case 'páscoa':
            return 'pascoa'
          case 'color bits':
            return 'colorbits'
          default:
            return lower
        }
      })
      return newArr.join(' ')
    } else {
      return arr[0].replace(/(es)|s$/g, '')
    }

  }
  // match name and/or keyword with term
  // https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-multi-match-query.html
  if (term) {
    const sort = query.sort.slice()
    const relevanceSortIndex = sort.findIndex(s => s.ad_relevance)
    sort.splice(relevanceSortIndex, 1)
    self.dsl.sort = sort
  }
  console.log(self)
  const modifiedTerm = changeWord(arr)
  const finalTerm = modifiedTerm || term
  self.mergeFilter({
    multi_match: {
      query: finalTerm,
      type: finalTerm.length > 6 ? 'best_fields' : 'phrase_prefix',
      fields: [
        'name',
        'keywords'
      ]
    }
  }, 'must')
  
  merge(self.dsl, {
    // handle terms suggestion
    // 'did you mean?'
    // https://www.elastic.co/guide/en/elasticsearch/reference/current/search-suggesters.html
    suggest: {
      text: term,
      words: {
        term: {
          field: 'name'
        }
      }
    }
  })
  return self
}

/**
 * @method
 * @name EcomSearch#setSearchTerm
 * @description Defines term to match with product name
 * and/or keywords on next search request.
 *
 * @param {string} term - Term to be searched
 * @returns {self}
 *
 * @example

// Set new search term
search.setSearchTerm('smartphone')

 * @example

// Set new term and run search request
search.setSearchTerm('notebook').fetch()

 */
