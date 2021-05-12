import { setupServer } from 'msw/node'
import { rest } from 'msw'
import { badToken } from '@test/utils'

export const server = setupServer(
  rest.put('/fts/:namespace/buckets/:bucket/objects/:id', (req, res, ctx) => {
    if (badToken(req)) return res(ctx.status(401))

    return res(ctx.status(204))
  })

, rest.post('/fts/:namespace/query', (req, res, ctx) => {
    if (badToken(req)) return res(ctx.status(401))
    if (req.url.searchParams.get('limit') !== '20') return res(ctx.status(400))

    return res(
      ctx.status(200)
    , ctx.json(['id'])
    )
  })

, rest.post('/fts/:namespace/buckets/:buckets/query', (req, res, ctx) => {
    if (badToken(req)) return res(ctx.status(401))
    if (req.url.searchParams.get('limit') !== '20') return res(ctx.status(400))

    return res(
      ctx.status(200)
    , ctx.json(['id'])
    )
  })

, rest.delete('/fts/:namespace/buckets/:bucket/objects/:id', (req, res, ctx) => {
    if (badToken(req)) return res(ctx.status(401))

    return res(ctx.status(204))
  })

, rest.delete('/fts/:namespace', (req, res, ctx) => {
    if (badToken(req)) return res(ctx.status(401))

    return res(ctx.status(204))
  })

, rest.delete('/fts/:namespace/buckets/:bucket', (req, res, ctx) => {
    if (badToken(req)) return res(ctx.status(401))

    return res(ctx.status(204))
  })

, rest.get('/fts/:namespace/stats', (req, res, ctx) => {
    return res(
      ctx.status(200)
    , ctx.json({
        namespace: req.params.namespace
      , buckets: 1
      , objects: 1
      })
    )
  })

, rest.get('/fts/:namespace/buckets/:bucket/stats', (req, res, ctx) => {
    return res(
      ctx.status(200)
    , ctx.json({
        namespace: req.params.namespace
      , bucket: req.params.bucket
      , objects: 1
      })
    )
  })

, rest.get('/fts', (req, res, ctx) => {
    return res(
      ctx.status(200)
    , ctx.json(['namespace'])
    )
  })

, rest.get('/fts/:namespace/buckets', (req, res, ctx) => {
    return res(
      ctx.status(200)
    , ctx.json(['bucket'])
    )
  })
)
