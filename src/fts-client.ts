import { createRPCClient } from '@utils/rpc-client.js'
import { ClientProxy } from 'delight-rpc'
import { IAPI, INamespaceStats, IBucketStats, IDocumentQueryResult, IQueryExpression } from './contract.js'
import { isAbortSignal, raceAbortSignals, timeoutSignal } from 'extra-abort'
import { isntUndefined } from '@blackglory/prelude'
export { INamespaceStats, IBucketStats, IDocumentQueryResult, IQueryExpression, IAndExpression, INotExpression, IOrExpression, IPhraseExpression, IPrefixExpression, ITermExpression, QueryKeyword } from './contract.js'

export interface IFTSClientOptions {
  server: string
  timeout?: number
  retryIntervalForReconnection?: number
}

export interface IFTSClientRequestOptions {
  signal?: AbortSignal
  timeout?: number | false
}

export class FTSClient {
  static async create(options: IFTSClientOptions): Promise<FTSClient> {
    const { client, close } = await createRPCClient(
      options.server
    , options.retryIntervalForReconnection
    , options.timeout
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
  , signalOrOptions?: AbortSignal | IFTSClientRequestOptions
  ): Promise<INamespaceStats> {
    return await this.client.getNamespaceStats(
      namespace
    , this.createSignal(signalOrOptions)
    )
  }

  async getBucketStats(
    namespace: string
  , bucket: string
  , signalOrOptions?: AbortSignal | IFTSClientRequestOptions
  ): Promise<IBucketStats> {
    return await this.client.getBucketStats(
      namespace
    , bucket
    , this.createSignal(signalOrOptions)
    )
  }

  async getAllNamespaces(
    signalOrOptions?: AbortSignal | IFTSClientRequestOptions
  ): Promise<string[]> {
    return await this.client.getAllNamespaces(
      this.createSignal(signalOrOptions)
    )
  }

  async getAllBuckets(
    namespace: string
  , signalOrOptions?: AbortSignal | IFTSClientRequestOptions
  ): Promise<string[]> {
    return await this.client.getAllBuckets(
      namespace
    , this.createSignal(signalOrOptions)
    )
  }

  async setDocument(
    namespace: string
  , bucket: string
  , documentId: string
  , lexemes: string[]
  , signalOrOptions?: AbortSignal | IFTSClientRequestOptions
  ): Promise<void> {
    await this.client.setDocument(
      namespace
    , bucket
    , documentId
    , lexemes
    , this.createSignal(signalOrOptions)
    )
  }

  async removeDocument(
    namespace: string
  , bucket: string
  , documentId: string
  , signalOrOptions?: AbortSignal | IFTSClientRequestOptions
  ): Promise<void> {
    await this.client.removeDocument(
      namespace
    , bucket
    , documentId
    , this.createSignal(signalOrOptions)
    )
  }

  async clearBucketsByNamespace(
    namespace: string
  , signalOrOptions?: AbortSignal | IFTSClientRequestOptions
  ): Promise<void> {
    await this.client.clearBucketsByNamespace(
      namespace
    , this.createSignal(signalOrOptions)
    )
  }

  async clearDocumentsByBucket(
    namespace: string
  , bucket: string
  , signalOrOptions?: AbortSignal | IFTSClientRequestOptions
  ): Promise<void> {
    await this.client.clearDocumentsByBucket(
      namespace
    , bucket
    , this.createSignal(signalOrOptions)
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
  , signalOrRequestOptions?: AbortSignal | IFTSClientRequestOptions
  ): Promise<IDocumentQueryResult[]> {
    return await this.client.queryDocuments(
      namespace
    , expression
    , options ?? {}
    , this.createSignal(signalOrRequestOptions)
    )
  }

  private createSignal(
    signalOrOptions: AbortSignal | IFTSClientRequestOptions = {}
  ): AbortSignal {
    const options: IFTSClientRequestOptions = isAbortSignal(signalOrOptions)
                                            ? { signal: signalOrOptions }
                                            : signalOrOptions

    return raceAbortSignals([
      options.signal
    , options.timeout !== false && (
        (options.timeout && timeoutSignal(options.timeout)) ??
        (this.timeout && timeoutSignal(this.timeout))
      )
    ])
  }
}
