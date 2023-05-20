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
      console.log({
        url: req.query.url,
        headers
      })
      try {
        const response = await axios.get(req.query.url, {
          headers,
          timeout: 3000,
          responseType: 'text',
          validateStatus: (status) => {
            return Boolean(status)
          }
        })
        console.log(response.data)
        res
          .writeHead(response.status, response.headers)
          .send(response.data)
      } catch (err) {
        console.error(err)
        res.status(400).send(err.message)
      }
    } else {
      return ssr(req, res)
    }
  })
