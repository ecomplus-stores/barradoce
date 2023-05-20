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
      let proxyUrl
      try {
        proxyUrl = new URL(req.query.url)
      } catch {
      }
      if (proxyUrl) {
        const { headers } = req
        headers['origin'] = headers['x-forwarded-host']
        headers['host'] = proxyUrl.hostname
        delete headers['forwarded']
        delete headers['via']
        delete headers['traceparent']
        delete headers['upgrade-insecure-requests']
        delete headers['x-timer']
        delete headers['x-varnish']
        Object.keys(headers).forEach((headerName) => {
          if (
            headerName.startsWith('x-forwarded-')
            || headerName.startsWith('cdn-')
            || headerName.startsWith('fastly-')
            || headerName.startsWith('x-firebase-')
            || headerName.startsWith('x-cloud-')
            || headerName.startsWith('x-appengine-')
            || headerName.startsWith('function-')
          ) {
            delete headers[headerName]
          }
        })
        console.log({
          url: proxyUrl.href,
          headers
        })
        try {
          const response = await axios.get(proxyUrl.href, {
            headers,
            timeout: 3000,
            responseType: 'text',
            validateStatus: (status) => {
              return Boolean(status)
            }
          })
          res.status(response.status)
          if (response.headers) {
            Object.keys(response.headers).forEach((headerName) => {
              res.set(headerName, response.headers[headerName])
            })
          }
          res.send(response.data)
        } catch (err) {
          console.error(err)
          res.status(400).send(err.message)
        }
      }
      res.sendStatus(400)
    } else {
      return ssr(req, res)
    }
  })
