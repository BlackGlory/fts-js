import { createRPCClient } from '@utils/rpc-client.js'
import { ClientProxy } from 'delight-rpc'
import { IAPI, INamespaceStats, IBucketStats, IDocumentQueryResult, IQueryExpression } from './contract.js'
import { raceAbortSignals, timeoutSignal } from 'extra-abort'
import { isntUndefined } from '@blackglory/prelude'
export { INamespaceStats, IBucketStats, IDocumentQueryResult, IQueryExpression, IAndExpression, INotExpression, IOrExpression, IPhraseExpression, IPrefixExpression, ITermExpression, QueryKeyword } from './contract.js'

export interface IFTSClientOptions {
  server: string
  timeout?: number
  retryIntervalForReconnection?: number
}

export class FTSClient {
  static async create(options: IFTSClientOptions): Promise<FTSClient> {
    const { client, close } = await createRPCClient(
      options.server
    , options.retryIntervalForReconnection
    )
    return new FTSClient(client, close, options.timeout)
  }

  private constructor(
    private client: ClientProxy<IAPI>
  , private closeClients: () => Promise<void>
  , private timeout?: number
  ) {}

  async close(): Promise<void> {
    await this.closeClients()
  }

  async getNamespaceStats(
    namespace: string
  , signal?: AbortSignal
  ): Promise<INamespaceStats> {
    return await this.client.getNamespaceStats(
      namespace
    , this.withTimeout(signal)
    )
  }

  async getBucketStats(
    namespace: string
  , bucket: string
  , signal?: AbortSignal
  ): Promise<IBucketStats> {
    return await this.client.getBucketStats(
      namespace
    , bucket
    , this.withTimeout(signal)
    )
  }

  async getAllNamespaces(signal?: AbortSignal): Promise<string[]> {
    return await this.client.getAllNamespaces(this.withTimeout(signal))
  }

  async getAllBuckets(
    namespace: string
  , signal?: AbortSignal
  ): Promise<string[]> {
    return await this.client.getAllBuckets(namespace, this.withTimeout(signal))
  }

  async setDocument(
    namespace: string
  , bucket: string
  , documentId: string
  , lexemes: string[]
  , signal?: AbortSignal
  ): Promise<void> {
    await this.client.setDocument(
      namespace
    , bucket
    , documentId
    , lexemes
    , this.withTimeout(signal)
    )
  }

  async removeDocument(
    namespace: string
  , bucket: string
  , documentId: string
  , signal?: AbortSignal
  ): Promise<void> {
    await this.client.removeDocument(
      namespace
    , bucket
    , documentId
    , this.withTimeout(signal)
    )
  }

  async clearBucketsByNamespace(
    namespace: string
  , signal?: AbortSignal
  ): Promise<void> {
    await this.client.clearBucketsByNamespace(namespace, this.withTimeout(signal))
  }

  async clearDocumentsByBucket(
    namespace: string
  , bucket: string
  , signal?: AbortSignal
  ): Promise<void> {
    await this.client.clearDocumentsByBucket(
      namespace
    , bucket
    , this.withTimeout(signal)
    )
  }

  async queryDocuments(
    namespace: string
  , expression: IQueryExpression
  , options?: {
      buckets?: string[]
      limit?: number
      offset?: number
    }
  , signal?: AbortSignal
  ): Promise<IDocumentQueryResult[]> {
    return await this.client.queryDocuments(
      namespace
    , expression
    , options ?? {}
    , this.withTimeout(signal)
    )
  }

  private withTimeout(signal?: AbortSignal): AbortSignal {
    return raceAbortSignals([
      isntUndefined(this.timeout) && timeoutSignal(this.timeout)
    , signal
    ])
  }
}
