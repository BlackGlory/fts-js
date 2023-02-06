import { createRPCClient } from '@utils/rpc-client.js'
import { ClientProxy, BatchClient, BatchClientProxy } from 'delight-rpc'
import { IAPI, INamespaceStats, IBucketStats, IDocumentQueryResult, IQueryExpression } from './contract.js'
import { timeoutSignal, withAbortSignal } from 'extra-abort'
export { INamespaceStats, IBucketStats, IDocumentQueryResult, IQueryExpression, IAndExpression, INotExpression, IOrExpression, IPhraseExpression, IPrefixExpression, ITermExpression, QueryKeyword } from './contract.js'

export interface IFTSClientOptions {
  server: string
  timeout?: number
  retryIntervalForReconnection?: number
}

export class FTSClient {
  static async create(options: IFTSClientOptions): Promise<FTSClient> {
    const { client, batchClient, proxy, close } = await createRPCClient(options.server)
    return new FTSClient(client, batchClient, proxy, close, options.timeout)
  }

  private constructor(
    private client: ClientProxy<IAPI>
  , private batchClient: BatchClient
  , private batchProxy: BatchClientProxy<IAPI, unknown>
  , private closeClients: () => Promise<void>
  , private timeout?: number
  ) {}

  async close(): Promise<void> {
    await this.closeClients()
  }

  async getNamespaceStats(namespace: string, timeout?: number): Promise<INamespaceStats> {
    return await this.withTimeout(
      () => this.client.getNamespaceStats(namespace)
    , timeout ?? this.timeout
    )
  }

  async getBucketStats(
    namespace: string
  , bucket: string
  , timeout?: number
  ): Promise<IBucketStats> {
    return await this.withTimeout(
      () => this.client.getBucketStats(namespace, bucket)
    , timeout ?? this.timeout
    )
  }

  async getAllNamespaces(timeout?: number): Promise<string[]> {
    return await this.withTimeout(
      () => this.client.getAllNamespaces()
    , timeout ?? this.timeout
    )
  }

  async getAllBuckets(namespace: string, timeout?: number): Promise<string[]> {
    return await this.withTimeout(
      () => this.client.getAllBuckets(namespace)
    , timeout ?? this.timeout
    )
  }

  async setDocument(
    namespace: string
  , bucket: string
  , documentId: string
  , lexemes: string[]
  , timeout?: number
  ): Promise<void> {
    await this.withTimeout(
      () => this.client.setDocument(namespace, bucket, documentId, lexemes)
    , timeout ?? this.timeout
    )
  }

  async removeDocument(
    namespace: string
  , bucket: string
  , documentId: string
  , timeout?: number
  ): Promise<void> {
    await this.withTimeout(
      () => this.client.removeDocument(namespace, bucket, documentId)
    , timeout ?? this.timeout
    )
  }

  async clearBucketsByNamespace(namespace: string, timeout?: number): Promise<void> {
    await this.withTimeout(
      () => this.client.clearBucketsByNamespace(namespace)
    , timeout ?? this.timeout
    )
  }

  async clearDocumentsByBucket(
    namespace: string
  , bucket: string
  , timeout?: number
  ): Promise<void> {
    await this.withTimeout(
      () => this.client.clearDocumentsByBucket(namespace, bucket)
    , timeout ?? this.timeout
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
  , timeout?: number
  ): Promise<IDocumentQueryResult[]> {
    return await this.withTimeout(
      () => this.client.queryDocuments(namespace, expression, options ?? {})
    , timeout ?? this.timeout
    )
  }

  private async withTimeout<T>(
    fn: () => PromiseLike<T>
  , timeout: number | undefined = this.timeout
  ): Promise<T> {
    if (timeout) {
      return await withAbortSignal(timeoutSignal(timeout), fn)
    } else {
      return await fn()
    }
  }
}
