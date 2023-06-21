const { onRequest } = require('firebase-functions/v2/https')

const { ssr } = require('@ecomplus/storefront-renderer/functions/')

process.env.STOREFRONT_LONG_CACHE = 'true'

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
