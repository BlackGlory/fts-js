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
    set(namespace: string, id: string, lexemes: string[]): Promise<void>
  `, async () => {
    const client = createClient()
    const namespace = 'namespace'
    const id = 'id'
    const lexemes = ['lexeme']

    const result = client.set(namespace, id, lexemes)
    const proResult = await result

    expect(result).toBePromise()
    expect(proResult).toBeUndefined()
  })

  test(`
    query(
      namespace: string
    , query: {
        expression: IQueryExpression
        limit?: number
        offset?: number
      }
    ): Promise<string[]>
  `, async () => {
    const client = createClient()
    const namespace = 'namespace'

    const result = client.query(namespace, {
      expression: ''
    , limit: 20
    , offset: 10
    })
    const proResult = await result

    expect(result).toBePromise()
    expect(proResult).toStrictEqual(['id'])
  })

  test('del(namespace: string, id: string): Promise<void>', async () => {
    const client = createClient()
    const namespace = 'namespace'
    const id = 'id'

    const result = client.del(namespace, id)
    const proResult = await result

    expect(result).toBePromise()
    expect(proResult).toBeUndefined()
  })

  test('clear(namespace: string): Prmise<void>', async () => {
    const client = createClient()
    const namespace = 'namespace'

    const result = client.clear(namespace)
    const proResult = await result

    expect(result).toBePromise()
    expect(proResult).toBeUndefined()
  })

  test(`
    stats(namespace: string): Promise<{ namespace: string; objects: number }>
  `, async () => {
    const client = createClient()
    const namespace = 'namespace'

    const result = client.stats(namespace)
    const proResult = await result

    expect(result).toBePromise()
    expect(proResult).toStrictEqual({
      namespace
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
})

function createClient() {
  return new FTSClient({
    server: 'http://localhost'
  , token: TOKEN
  })
}
