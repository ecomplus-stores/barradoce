const functions = require('firebase-functions')
const axios = require('axios')

const { ssr } = require('@ecomplus/storefront-renderer/functions/')

process.env.STOREFRONT_LONG_CACHE = 'true'

exports.ssr = functions
  .runWith({
    memory: '512MB',
    minInstances: 2,
  })
  .https.onRequest(async (req, res) => {
    if (req.url.startsWith('/reverse-proxy/')) {
      const { headers } = req
      delete headers['origin']
      delete headers['host']
      delete headers['referer']
      const { response } = await axios.get(req.query.url, {
        headers,
        timeout: 3000,
        responseType: 'text',
        validateStatus: (status) => {
          return Boolean(status)
        }
      })
      res.writeHead(response.status, response.headers).send(response.data)
    } else {
      return ssr(req, res)
    }
  })
