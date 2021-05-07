import { fetch } from 'extra-fetch'
import { put, get, del, post } from 'extra-request'
import { url, pathname, json, searchParams, signal, basicAuth, keepalive }
  from 'extra-request/lib/es2018/transformers'
import { ok, toJSON } from 'extra-response'
import { QueryKeyword } from './query-keyword'

export { QueryKeyword } from './query-keyword'
export { HTTPClientError } from '@blackglory/http-status'

export interface IFTSClientOptions {
  server: string
  token?: string
  basicAuth?: {
    username: string
    password: string
  }
  keepalive?: boolean
}

export interface IFTSClientRequestOptions {
  signal?: AbortSignal
  token?: string
  keepalive?: boolean
}

export interface IFTSClientRequestOptionsWithoutToken {
  signal?: AbortSignal
  keepalive?: boolean
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

export class FTSClient {
  constructor(private options: IFTSClientOptions) {}

  async set(
    namespace: string
  , id: string
  , lexemes: string[]
  , options: IFTSClientRequestOptions = {}
  ): Promise<void> {
    const token = options.token ?? this.options.token
    const auth = this.options.basicAuth
    const req = put(
      url(this.options.server)
    , pathname(`/fts/${namespace}/objects/${id}`)
    , token && searchParams({ token })
    , auth && basicAuth(auth.username, auth.password)
    , json(lexemes)
    , options.signal && signal(options.signal)
    , keepalive(options.keepalive ?? this.options.keepalive)
    )

    await fetch(req).then(ok)
  }

  async query(
    namespace: string
  , query: {
      expression: IQueryExpression
      limit?: number
      offset?: number
    }
  , options: IFTSClientRequestOptions = {}
  ): Promise<string[]> {
    const token = options.token ?? this.options.token
    const auth = this.options.basicAuth
    const req = post(
      url(this.options.server)
    , pathname(`/fts/${namespace}/query`)
    , token && searchParams({ token })
    , auth && basicAuth(auth.username, auth.password)
    , json(query.expression)
    , options.signal && signal(options.signal)
    , keepalive(options.keepalive ?? this.options.keepalive)
    )

    return await fetch(req)
      .then(ok)
      .then(toJSON) as string[]
  }

  async del(
    namespace: string
  , id: string
  , options: IFTSClientRequestOptions = {}
  ): Promise<void> {
    const token = options.token ?? this.options.token
    const auth = this.options.basicAuth
    const req = del(
      url(this.options.server)
    , pathname(`/fts/${namespace}/objects/${id}`)
    , token && searchParams({ token })
    , auth && basicAuth(auth.username, auth.password)
    , options.signal && signal(options.signal)
    , keepalive(options.keepalive ?? this.options.keepalive)
    )

    await fetch(req).then(ok)
  }

  async clear(
    namespace: string
  , options: IFTSClientRequestOptions = {}
  ): Promise<void> {
    const token = options.token ?? this.options.token
    const auth = this.options.basicAuth
    const req = del(
      url(this.options.server)
    , pathname(`/fts/${namespace}/objects`)
    , token && searchParams({ token })
    , auth && basicAuth(auth.username, auth.password)
    , options.signal && signal(options.signal)
    , keepalive(options.keepalive ?? this.options.keepalive)
    )

    await fetch(req).then(ok)
  }

  async stats(
    namespace: string
  , options: IFTSClientRequestOptionsWithoutToken = {}
  ): Promise<{ namespace: string; objects: number }> {
    const auth = this.options.basicAuth
    const req = get(
      url(this.options.server)
    , pathname(`/fts/${namespace}/stats`)
    , auth && basicAuth(auth.username, auth.password)
    , options.signal && signal(options.signal)
    , keepalive(options.keepalive ?? this.options.keepalive)
    )

    return await fetch(req)
      .then(ok)
      .then(toJSON) as {
        namespace: string
        objects: number
      }
  }

  async getAllNamespaces(
    options: IFTSClientRequestOptionsWithoutToken = {}
  ): Promise<string[]> {
    const auth = this.options.basicAuth
    const req = get(
      url(this.options.server)
    , pathname('/fts')
    , auth && basicAuth(auth.username, auth.password)
    , options.signal && signal(options.signal)
    , keepalive(options.keepalive ?? this.options.keepalive)
    )

    return await fetch(req)
      .then(ok)
      .then(toJSON) as string[]
  }
}
