import { IAPI, expectedVersion } from '@src/contract.js'
import { ClientProxy } from 'delight-rpc'
import { createClient } from '@delight-rpc/extra-native-websocket'
import { ExtraNativeWebSocket, autoReconnect } from 'extra-native-websocket'

export async function createRPCClient(
  url: string
, retryIntervalForReconnection?: number
): Promise<{
  client: ClientProxy<IAPI>
  close: () => Promise<void>
}> {
  const ws = new ExtraNativeWebSocket(() => new WebSocket(url))
  const cancelAutoReconnect = autoReconnect(ws, retryIntervalForReconnection)
  await ws.connect()

  const [client, closeClient] = createClient<IAPI>(ws, { expectedVersion })

  return {
    client
  , close: async () => {
      closeClient()
      cancelAutoReconnect()
      await ws.close()
    }
  }
}
