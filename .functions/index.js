const { initializeApp } = require('firebase-admin/app')
const { getFirestore, Timestamp } = require('firebase-admin/firestore')
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
      const { headers, status, body, __timestamp } = cacheDoc.data()
      Object.keys(headers).forEach((headerName) => {
        res.set(headerName, headers[headerName])
      })
      res.status(status || 200).send(body)
      if (Timestamp.now().toMillis() - __timestamp.toMillis() < 1000 * 60 * 5) {
        return true
      }
    }
  } catch (err) {
    cacheRef = null
    warn(err)
  }
  const _send = res.send
  res.send = function (body) {
    if (!res.headersSent) {
      _send.apply(res, arguments)
    }
    if (cacheRef) {
      cacheRef.set({
        headers: res.getHeaders(),
        status: res.statusCode,
        body,
        __timestamp: Timestamp.now()
      }).catch(warn)
    }
  }
  const _end = res.end
  res.end = function () {
    if (!res.headersSent) {
      _end.apply(res, arguments)
    }
  }
  return ssr(req, res)
})

exports.reverseproxy = onRequest({
  concurrency: 80,
  minInstances: 0,
  memory: '1GiB',
}, ssr)
