import { fetch } from 'extra-fetch'
import { put, get, del, post, IHTTPOptionsTransformer } from 'extra-request'
import { url, appendPathname, json, searchParams, signal, basicAuth, keepalive, header }
  from 'extra-request/transformers/index.js'
import { ok, toJSON } from 'extra-response'
import { expectedVersion } from './utils'
import { timeoutSignal, raceAbortSignals } from 'extra-abort'
import { Falsy } from 'justypes'

export enum QueryKeyword {
  And = 0
, Or = 1
, Not = 2
, Phrase = 3
, Prefix = 4
}

export interface IFTSClientOptions {
  server: string
  token?: string
  basicAuth?: {
    username: string
    password: string
  }
  keepalive?: boolean
  timeout?: number
}

export interface IFTSClientRequestOptions {
  signal?: AbortSignal
  token?: string
  keepalive?: boolean
  timeout?: number | false
}

export interface IFTSClientRequestOptionsWithoutToken {
  signal?: AbortSignal
  keepalive?: boolean
  timeout?: number | false
}

export type IQueryExpression =
| IWordExpression
| IPhraseExpression
| IPrefixExpression
| IAndExpression
| IOrExpression
| INotExpression

export type IWordExpression = string
export type IPhraseExpression = [QueryKeyword.Phrase, ...IQueryExpression[]]
export type IPrefixExpression = [QueryKeyword.Prefix, string]
export type IAndExpression = [IQueryExpression, QueryKeyword.And, IQueryExpression]
export type IOrExpression = [IQueryExpression, QueryKeyword.Or, IQueryExpression]
export type INotExpression = [QueryKeyword.Not, IQueryExpression]

interface IQueryResult {
  bucket: string
  id: string
}

export class FTSClient {
  constructor(private options: IFTSClientOptions) {}

  private getCommonTransformers(
    options: IFTSClientRequestOptions | IFTSClientRequestOptionsWithoutToken
  ): Array<IHTTPOptionsTransformer | Falsy> {
    const token = 'token' in options
                  ? (options.token ?? this.options.token)
                  : this.options.token
    const auth = this.options.basicAuth

    return [
      url(this.options.server)
    , auth && basicAuth(auth.username, auth.password)
    , token && searchParams({ token })
    , signal(raceAbortSignals([
        options.signal
      , options.timeout !== false && (
          (options.timeout && timeoutSignal(options.timeout)) ??
          (this.options.timeout && timeoutSignal(this.options.timeout))
        )
      ]))
    , (options.keepalive ?? this.options.keepalive) && keepalive()
    , header('Accept-Version', expectedVersion)
    ]
  }

  /**
   * @throws {AbortError}
   */
  async set(
    namespace: string
  , bucket: string
  , id: string
  , lexemes: string[]
  , options: IFTSClientRequestOptions = {}
  ): Promise<void> {
    const req = put(
      ...this.getCommonTransformers(options)
    , appendPathname(`/fts/${namespace}/buckets/${bucket}/objects/${id}`)
    , json(lexemes)
    )

    await fetch(req).then(ok)
  }

  /**
   * @throws {AbortError}
   */
  async query(
    namespace: string
  , query: {
      expression: IQueryExpression
      buckets?: string[]
      limit?: number
      offset?: number
    }
  , options: IFTSClientRequestOptions = {}
  ): Promise<IQueryResult[]> {
    const { buckets, limit, offset } = query

    const req = post(
      ...this.getCommonTransformers(options)
    , appendPathname(
        buckets
      ? `/fts/${namespace}/buckets/${buckets.join(',')}/query`
      : `/fts/${namespace}/query`
      )
    , json(query.expression)
    , limit && searchParams({ limit: limit.toString() })
    , offset && searchParams({ offset: offset.toString() })
    )

    return await fetch(req)
      .then(ok)
      .then(toJSON) as IQueryResult[]
  }

  /**
   * @throws {AbortError}
   */
  async del(
    namespace: string
  , bucket: string
  , id: string
  , options: IFTSClientRequestOptions = {}
  ): Promise<void> {
    const req = del(
      ...this.getCommonTransformers(options)
    , appendPathname(`/fts/${namespace}/buckets/${bucket}/objects/${id}`)
    )

    await fetch(req).then(ok)
  }

  /**
   * @throws {AbortError}
   */
  async clearNamespace(
    namespace: string
  , options: IFTSClientRequestOptions = {}
  ): Promise<void> {
    const req = del(
      ...this.getCommonTransformers(options)
    , appendPathname(`/fts/${namespace}`)
    )

    await fetch(req).then(ok)
  }

  /**
   * @throws {AbortError}
   */
  async clearBucket(
    namespace: string
  , bucket: string
  , options: IFTSClientRequestOptions = {}
  ): Promise<void> {
    const req = del(
      ...this.getCommonTransformers(options)
    , appendPathname(`/fts/${namespace}/buckets/${bucket}`)
    )

    await fetch(req).then(ok)
  }

  /**
   * @throws {AbortError}
   */
  async getNamespaceStats(
    namespace: string
  , options: IFTSClientRequestOptionsWithoutToken = {}
  ): Promise<{ namespace: string; objects: number }> {
    const req = get(
      ...this.getCommonTransformers(options)
    , appendPathname(`/fts/${namespace}/stats`)
    )

    return await fetch(req)
      .then(ok)
      .then(toJSON) as {
        namespace: string
        objects: number
      }
  }

  /**
   * @throws {AbortError}
   */
  async getBucketStats(
    namespace: string
  , bucket: string
  , options: IFTSClientRequestOptionsWithoutToken = {}
  ): Promise<{ namespace: string; objects: number }> {
    const req = get(
      ...this.getCommonTransformers(options)
    , appendPathname(`/fts/${namespace}/buckets/${bucket}/stats`)
    )

    return await fetch(req)
      .then(ok)
      .then(toJSON) as {
        namespace: string
        objects: number
      }
  }

  /**
   * @throws {AbortError}
   */
  async getAllNamespaces(
    options: IFTSClientRequestOptionsWithoutToken = {}
  ): Promise<string[]> {
    const req = get(
      ...this.getCommonTransformers(options)
    , appendPathname('/fts')
    )

    return await fetch(req)
      .then(ok)
      .then(toJSON) as string[]
  }

  /**
   * @throws {AbortError}
   */
  async getAllBuckets(
    namespace: string
  , options: IFTSClientRequestOptionsWithoutToken = {}
  ): Promise<string[]> {
    const req = get(
      ...this.getCommonTransformers(options)
    , appendPathname(`/fts/${namespace}/buckets`)
    )

    return await fetch(req)
      .then(ok)
      .then(toJSON) as string[]
  }
}
