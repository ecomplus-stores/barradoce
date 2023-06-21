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
  const _send = res.send
  const _end = res.end
  let body = null
  res.send = function (html) {
    body = html
    if (!res.headersSent) {
      _send.apply(res, arguments)
    }
  }
  res.end = function () {
    if (!res.headersSent) {
      _end.apply(res, arguments)
    }
  }
  ssr(req, res)
  if (cacheRef) {
    try {
      await cacheRef.set({
        headers: res.getHeaders(),
        status: res.statusCode,
        body,
        __timestamp: Timestamp.now()
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
