const functions = require('firebase-functions')

const { ssr } = require('@ecomplus/storefront-renderer/functions/')

process.env.STOREFRONT_LONG_CACHE = 'true'

exports.ssr = functions
  .runWith({
    memory: '1GB',
    minInstances: 1,
  })
  .https.onRequest((req, res) => ssr(req, res))
