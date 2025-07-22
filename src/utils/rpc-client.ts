import { IAPI, expectedVersion } from '@src/contract.js'
import { ClientProxy } from 'delight-rpc'
import { createClient } from '@delight-rpc/extra-websocket'
import { WebSocket } from 'ws'
import { ExtraWebSocket, autoReconnect } from 'extra-websocket'
import { timeoutSignal } from 'extra-abort'

export async function createRPCClient(
  url: string
, retryIntervalForReconnection?: number
, timeoutForConnection?: number
): Promise<{
  client: ClientProxy<IAPI>
  close: () => Promise<void>
}> {
  const ws = new ExtraWebSocket(() => new WebSocket(url))
  const cancelAutoReconnect = autoReconnect(
    ws
  , retryIntervalForReconnection
  , timeoutForConnection
  )
  await ws.connect(
    timeoutForConnection
  ? timeoutSignal(timeoutForConnection)
  : undefined
  )

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
