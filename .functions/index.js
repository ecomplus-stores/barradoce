const { onRequest } = require('firebase-functions/v2/https')
const functions = require('firebase-functions')

const { ssr } = require('@ecomplus/storefront-renderer/functions/')

process.env.STOREFRONT_LONG_CACHE = 'true'

exports.ssr = functions
  .runWith({
    memory: '512MB',
    minInstances: 0,
  })
  .https.onRequest((req, res) => ssr(req, res))

exports.ssr2 = onRequest({
  concurrency: 80,
  minInstances: 0,
  memory: '2GiB',
}, ssr)

exports.reverseproxy = onRequest({
  concurrency: 80,
  minInstances: 0,
  memory: '1GiB',
}, ssr)
