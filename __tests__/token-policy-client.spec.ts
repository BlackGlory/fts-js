import { server } from '@test/token-policy.mock'
import { TokenPolicyClient } from '@src/token-policy-client'
import { ADMIN_PASSWORD } from '@test/utils'
import '@blackglory/jest-matchers'

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
beforeEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('TokenPolicyClient', () => {
  test('getNamespaces(): Promise<string[]>', async () => {
    const client = createClient()

    const result = client.getNamespaces()
    const proResult = await result

    expect(result).toBePromise()
    expect(proResult).toStrictEqual(['namespace'])
  })

  test(`
    get(namespace: string): Promise<{
      writeTokenRequired: boolean | null
      queryTokenRequired: boolean | null
    }>
  `, async () => {
    const client = createClient()
    const namespace = 'namespace'

    const result = client.get(namespace)
    const proResult = await result

    expect(result).toBePromise()
    expect(proResult).toStrictEqual({
      writeTokenRequired: true
    , queryTokenRequired: false
    , deleteTokenRequired: null
    })
  })

  test('setWriteTokenRequired(namespace: string, val: boolean): Promise<void>', async () => {
    const client = createClient()
    const namespace = 'namespace'
    const val = true

    const result = client.setWriteTokenRequired(namespace, val)
    const proResult = await result

    expect(result).toBePromise()
    expect(proResult).toBeUndefined()
  })

  test('removeWriteTokenRequired(namespace: string): Promise<void>', async () => {
    const client = createClient()
    const namespace = 'namespace'

    const result = client.removeWriteTokenRequired(namespace)
    const proResult = await result

    expect(result).toBePromise()
    expect(proResult).toBeUndefined()
  })

  test('setQueryTokenRequired(namespace: string, val: boolean): Promise<void>', async () => {
    const client = createClient()
    const namespace = 'namespace'
    const val = true

    const result = client.setQueryTokenRequired(namespace, val)
    const proResult = await result

    expect(result).toBePromise()
    expect(proResult).toBeUndefined()
  })

  test('removeQueryTokenRequired(namespace: string): Promise<void>', async () => {
    const client = createClient()
    const namespace = 'namespace'

    const result = client.removeQueryTokenRequired(namespace)
    const proResult = await result

    expect(result).toBePromise()
    expect(proResult).toBeUndefined()
  })

  test('setDeleteTokenRequired(namespace: string, val: boolean): Promise<void>', async () => {
    const client = createClient()
    const namespace = 'namespace'
    const val = true

    const result = client.setDeleteTokenRequired(namespace, val)
    const proResult = await result

    expect(result).toBePromise()
    expect(proResult).toBeUndefined()
  })

  test('removeDeleteTokenRequired(namespace: string): Promise<void>', async () => {
    const client = createClient()
    const namespace = 'namespace'

    const result = client.removeDeleteTokenRequired(namespace)
    const proResult = await result

    expect(result).toBePromise()
    expect(proResult).toBeUndefined()
  })
})

function createClient() {
  return new TokenPolicyClient({
    server: 'http://localhost'
  , adminPassword: ADMIN_PASSWORD
  })
}
