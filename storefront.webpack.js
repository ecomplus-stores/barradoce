const path = require('path')
const dirSearchAlias = path.resolve(__dirname, 'template/js/lib/search-engine')
const pathDslAlias = path.resolve(dirSearchAlias, 'dsl')

module.exports = () => ({
  resolve: {
    alias: {
      './methods/set-search-term': path.resolve(dirSearchAlias, 'set-search-term'),
      './js/ShippingLine.js': path.resolve(__dirname, 'template/js/custom-js/js/ShippingLine.js'),
      './html/ShippingCalculator.html': path.resolve(__dirname, 'template/js/custom-js/html/ShippingCalculator.html'),
      './js/ShippingCalculator.js': path.resolve(__dirname, 'template/js/custom-js/js/ShippingCalculator.js'),
      './js/APicture.js': path.resolve(__dirname, 'template/js/custom-js/js/APicture.js'),
      './html/APicture.html': path.resolve(__dirname, 'template/js/custom-js/html/APicture.html')
    }
  }
})
