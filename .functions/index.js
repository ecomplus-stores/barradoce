const { onRequest } = require('firebase-functions/v2/https')

const { ssr } = require('@ecomplus/storefront-renderer/functions/')

process.env.STOREFRONT_LONG_CACHE = 'true'

exports.ssr = onRequest({
  concurrency: 80,
  memory: '512MiB',
  minInstances: 1,
  timeoutSeconds: 15,
}, ssr)
