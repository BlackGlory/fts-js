import { server } from './token-policy-manager.mock'
import { TokenPolicyManager } from '@manager/token-policy-manager'
import { ADMIN_PASSWORD } from '@test/utils'

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
beforeEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('TokenPolicyManager', () => {
  test('getNamespaces(): Promise<string[]>', async () => {
    const client = createManager()

    const result = await client.getNamespaces()

    expect(result).toStrictEqual(['namespace'])
  })

  test(`
    get(namespace: string): Promise<{
      writeTokenRequired: boolean | null
      queryTokenRequired: boolean | null
    }>
  `, async () => {
    const client = createManager()
    const namespace = 'namespace'

    const result = await client.get(namespace)

    expect(result).toStrictEqual({
      writeTokenRequired: true
    , queryTokenRequired: false
    , deleteTokenRequired: null
    })
  })

  test('setWriteTokenRequired(namespace: string, val: boolean): Promise<void>', async () => {
    const client = createManager()
    const namespace = 'namespace'
    const val = true

    const result = await client.setWriteTokenRequired(namespace, val)

    expect(result).toBeUndefined()
  })

  test('removeWriteTokenRequired(namespace: string): Promise<void>', async () => {
    const client = createManager()
    const namespace = 'namespace'

    const result = await client.removeWriteTokenRequired(namespace)

    expect(result).toBeUndefined()
  })

  test('setQueryTokenRequired(namespace: string, val: boolean): Promise<void>', async () => {
    const client = createManager()
    const namespace = 'namespace'
    const val = true

    const result = await client.setQueryTokenRequired(namespace, val)

    expect(result).toBeUndefined()
  })

  test('removeQueryTokenRequired(namespace: string): Promise<void>', async () => {
    const client = createManager()
    const namespace = 'namespace'

    const result = await client.removeQueryTokenRequired(namespace)

    expect(result).toBeUndefined()
  })

  test('setDeleteTokenRequired(namespace: string, val: boolean): Promise<void>', async () => {
    const client = createManager()
    const namespace = 'namespace'
    const val = true

    const result = await client.setDeleteTokenRequired(namespace, val)

    expect(result).toBeUndefined()
  })

  test('removeDeleteTokenRequired(namespace: string): Promise<void>', async () => {
    const client = createManager()
    const namespace = 'namespace'

    const result = await client.removeDeleteTokenRequired(namespace)

    expect(result).toBeUndefined()
  })
})

function createManager() {
  return new TokenPolicyManager({
    server: 'http://localhost'
  , adminPassword: ADMIN_PASSWORD
  })
}
