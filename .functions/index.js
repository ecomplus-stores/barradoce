const { onRequest } = require('firebase-functions/v2/https')

const { ssr } = require('@ecomplus/storefront-renderer/functions/')

process.env.STOREFRONT_LONG_CACHE = 'true'

exports.ssr = onRequest({
  concurrency: 80,
  minInstances: 1,
  memory: '512MiB',
}, ssr)
