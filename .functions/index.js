const functions = require('firebase-functions')

const { ssr } = require('@ecomplus/storefront-renderer/functions/')

process.env.STOREFRONT_LONG_CACHE = 'true'

exports.ssr = functions
  .runWith({ minInstances: 2 })
  .https.onRequest((req, res) => ssr(req, res))
