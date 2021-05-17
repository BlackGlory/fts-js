import { server } from '@test/fts.mock'
import { FTSClient } from '@src/fts-client'
import { TOKEN } from '@test/utils'
import '@blackglory/jest-matchers'
import 'jest-extended'

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

    const result = client.set(namespace, bucket, id, lexemes)
    const proResult = await result

    expect(result).toBePromise()
    expect(proResult).toBeUndefined()
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

      const result = client.query(namespace, {
        expression: ''
      , limit: 20
      , offset: 10
      })
      const proResult = await result

      expect(result).toBePromise()
      expect(proResult).toStrictEqual([
        { bucket: 'bucket', id: 'id' }
      ])
    })

    test('with buckets', async () => {
      const client = createClient()
      const namespace = 'namespace'

      const result = client.query(namespace, {
        expression: ''
      , buckets: ['bucket']
      , limit: 20
      , offset: 10
      })
      const proResult = await result

      expect(result).toBePromise()
      expect(proResult).toStrictEqual([
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

    const result = client.del(namespace, bucket, id)
    const proResult = await result

    expect(result).toBePromise()
    expect(proResult).toBeUndefined()
  })

  test('clearNamespace(namespace: string): Prmise<void>', async () => {
    const client = createClient()
    const namespace = 'namespace'

    const result = client.clearNamespace(namespace)
    const proResult = await result

    expect(result).toBePromise()
    expect(proResult).toBeUndefined()
  })

  test('clearBucket(namespace: string, bucket: string): Prmise<void>', async () => {
    const client = createClient()
    const namespace = 'namespace'
    const bucket = 'bucket'

    const result = client.clearBucket(namespace, bucket)
    const proResult = await result

    expect(result).toBePromise()
    expect(proResult).toBeUndefined()
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

    const result = client.getNamespaceStats(namespace)
    const proResult = await result

    expect(result).toBePromise()
    expect(proResult).toStrictEqual({
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

    const result = client.getBucketStats(namespace, bucket)
    const proResult = await result

    expect(result).toBePromise()
    expect(proResult).toStrictEqual({
      namespace
    , bucket
    , objects: 1
    })
  })

  test('getAllNamespaces(): Promise<string[]>', async () => {
    const client = createClient()

    const result = client.getAllNamespaces()
    const proResult = await result

    expect(result).toBePromise()
    expect(proResult).toStrictEqual(['namespace'])
  })

  test('getAllBuckets(): Promise<string[]>', async () => {
    const client = createClient()
    const namespace = 'namespace'

    const result = client.getAllBuckets(namespace)
    const proResult = await result

    expect(result).toBePromise()
    expect(proResult).toStrictEqual(['bucket'])
  })
})

function createClient() {
  return new FTSClient({
    server: 'http://localhost'
  , token: TOKEN
  })
}
