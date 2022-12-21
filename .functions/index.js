const functions = require('firebase-functions')

const { ssr } = require('@ecomplus/storefront-renderer/functions/')

process.env.STOREFRONT_LONG_CACHE = 'false'

exports.ssr = functions.https.onRequest((req, res) => ssr(req, res))
