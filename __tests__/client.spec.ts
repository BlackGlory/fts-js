import { server } from '@test/client.mock'
import { FTSClient } from '@src/client'
import { TOKEN } from '@test/utils'

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
beforeEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('FTSClient', () => {
  test(`
    set(
      namespace: string
    , bucket: string
    , id: string
    , lexemes: string[]
    ): Promise<void>
  `, async () => {
    const client = createClient()
    const namespace = 'namespace'
    const bucket = 'bucket'
    const id = 'id'
    const lexemes = ['lexeme']

    const result = await client.set(namespace, bucket, id, lexemes)

    expect(result).toBeUndefined()
  })

  describe(`
    query(
      namespace: string
    , query: {
        expression: IQueryExpression
        buckets?: string[]
        limit?: number
        offset?: number
      }
    ): Promise<string[]>
  `, () => {
    test('no buckets', async () => {
      const client = createClient()
      const namespace = 'namespace'

      const result = await client.query(namespace, {
        expression: ''
      , limit: 20
      , offset: 10
      })

      expect(result).toStrictEqual([
        { bucket: 'bucket', id: 'id' }
      ])
    })

    test('with buckets', async () => {
      const client = createClient()
      const namespace = 'namespace'

      const result = await client.query(namespace, {
        expression: ''
      , buckets: ['bucket']
      , limit: 20
      , offset: 10
      })

      expect(result).toStrictEqual([
        { bucket: 'bucket', id: 'id' }
      ])
    })
  })

  test(`
    del(namespace: string, bucket: string, id: string): Promise<void>
  `, async () => {
    const client = createClient()
    const namespace = 'namespace'
    const bucket = 'bucket'
    const id = 'id'

    const result = await client.del(namespace, bucket, id)

    expect(result).toBeUndefined()
  })

  test('clearNamespace(namespace: string): Prmise<void>', async () => {
    const client = createClient()
    const namespace = 'namespace'

    const result = await client.clearNamespace(namespace)

    expect(result).toBeUndefined()
  })

  test('clearBucket(namespace: string, bucket: string): Prmise<void>', async () => {
    const client = createClient()
    const namespace = 'namespace'
    const bucket = 'bucket'

    const result = await client.clearBucket(namespace, bucket)

    expect(result).toBeUndefined()
  })

  test(`
    getNamespaceStats(namespace: string): Promise<{
      namespace: string
      buckets: number
      objects: number
    }>
  `, async () => {
    const client = createClient()
    const namespace = 'namespace'

    const result = await client.getNamespaceStats(namespace)

    expect(result).toStrictEqual({
      namespace
    , buckets: 1
    , objects: 1
    })
  })

  test(`
    getBucketStats(namespace: string, bucket: string): Promise<{
      namespace: string
      bucket: string
      objects: number
    }>
  `, async () => {
    const client = createClient()
    const namespace = 'namespace'
    const bucket = 'bucket'

    const result = await client.getBucketStats(namespace, bucket)

    expect(result).toStrictEqual({
      namespace
    , bucket
    , objects: 1
    })
  })

  test('getAllNamespaces(): Promise<string[]>', async () => {
    const client = createClient()

    const result = await client.getAllNamespaces()

    expect(result).toStrictEqual(['namespace'])
  })

  test('getAllBuckets(): Promise<string[]>', async () => {
    const client = createClient()
    const namespace = 'namespace'

    const result = await client.getAllBuckets(namespace)

    expect(result).toStrictEqual(['bucket'])
  })
})

function createClient() {
  return new FTSClient({
    server: 'http://localhost'
  , token: TOKEN
  })
}
