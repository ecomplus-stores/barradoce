const { initializeApp } = require('firebase-admin/app')
const { getFirestore } = require('firebase-admin/firestore')
const { onRequest } = require('firebase-functions/v2/https')
const { warn } = require('firebase-functions/logger')

const { ssr } = require('@ecomplus/storefront-renderer/functions/')

process.env.STOREFRONT_LONG_CACHE = 'true'

initializeApp()

exports.ssr2 = onRequest({
  concurrency: 80,
  minInstances: 0,
  memory: '2GiB',
}, async (req, res) => {
  let cacheRef
  try {
    const db = getFirestore()
    cacheRef = db.doc(`ssrCache/${req.path}`)
    const cacheDoc = await cacheRef.get()
    if (cacheDoc.exists) {
      const { headers, status, body } = doc.data()
      Object.keys(headers).forEach((headerName) => {
        res.set(headerName, headers[headerName])
      })
      res.status(status || 200).send(body)
    }
  } catch (err) {
    cacheRef = null
    warn(err)
  }
  const { send, end } = res
  let body = null
  res.send = (html) => {
    body = html
    if (!res.headersSent) {
      send(html)
    }
  }
  res.end = () => {
    if (!res.headersSent) {
      end()
    }
  }
  ssr(req, res)
  if (cacheRef) {
    try {
      await cacheRef.set({
        headers: res.getHeaders(),
        status: res.statusCode,
        body
      })
    } catch (err) {
      warn(err)
    }
  }
})

exports.reverseproxy = onRequest({
  concurrency: 80,
  minInstances: 0,
  memory: '1GiB',
}, ssr)
