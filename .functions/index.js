const { initializeApp } = require('firebase-admin/app')
const { onRequest } = require('firebase-functions/v2/https')

const { ssr } = require('@ecomplus/storefront-renderer/functions/')

process.env.STOREFRONT_LONG_CACHE = 'false'

initializeApp()

exports.ssr2 = onRequest({
  concurrency: 80,
  minInstances: 0,
  memory: '1GiB',
}, async (req, res) => {
  if (req.path.startsWith('/~partytown')) {
    res.sendStatus(404)
    return null
  }
  res.set('x-load-took', '1')
  return ssr(req, res)
})

exports.reverseproxy = onRequest({
  concurrency: 80,
  minInstances: 0,
  memory: '1GiB',
}, ssr)
