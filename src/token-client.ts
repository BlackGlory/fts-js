import { fetch } from 'extra-fetch'
import { get, put, del } from 'extra-request'
import { pathname } from 'extra-request/lib/es2018/transformers'
import { ok, toJSON } from 'extra-response'
import { IFTSManagerRequestOptions, FTSManagerBase } from './utils'

interface ITokenInfo {
  token: string
  write: boolean
  query: boolean
  delete: boolean
}

export class TokenClient extends FTSManagerBase {
  async getNamespaces(options: IFTSManagerRequestOptions = {}): Promise<string[]> {
    const req = get(
      ...this.getCommonTransformers(options)
    , pathname('/admin/fts-with-tokens')
    )

    return await fetch(req)
      .then(ok)
      .then(toJSON) as string[]
  }

  async getTokens(
    namespace: string
  , options: IFTSManagerRequestOptions = {}
  ): Promise<ITokenInfo[]> {
    const req = get(
      ...this.getCommonTransformers(options)
    , pathname(`/admin/fts/${namespace}/tokens`)
    )

    return await fetch(req)
      .then(ok)
      .then(toJSON) as ITokenInfo[]
  }

  async addWriteToken(
    namespace: string
  , token: string
  , options: IFTSManagerRequestOptions = {}
  ): Promise<void> {
    const req = put(
      ...this.getCommonTransformers(options)
    , pathname(`/admin/fts/${namespace}/tokens/${token}/write`)
    )

    await fetch(req).then(ok)
  }

  async removeWriteToken(
    namespace: string
  , token: string
  , options: IFTSManagerRequestOptions = {}
  ): Promise<void> {
    const req = del(
      ...this.getCommonTransformers(options)
    , pathname(`/admin/fts/${namespace}/tokens/${token}/write`)
    )

    await fetch(req).then(ok)
  }

  async addQueryToken(
    namespace: string
  , token: string
  , options: IFTSManagerRequestOptions = {}
  ): Promise<void> {
    const req = put(
      ...this.getCommonTransformers(options)
    , pathname(`/admin/fts/${namespace}/tokens/${token}/query`)
    )

    await fetch(req).then(ok)
  }

  async removeQueryToken(
    namespace: string
  , token: string
  , options: IFTSManagerRequestOptions = {}
  ): Promise<void> {
    const req = del(
      ...this.getCommonTransformers(options)
    , pathname(`/admin/fts/${namespace}/tokens/${token}/query`)
    )

    await fetch(req).then(ok)
  }

  async addDeleteToken(
    namespace: string
  , token: string
  , options: IFTSManagerRequestOptions = {}
  ): Promise<void> {
    const req = put(
      ...this.getCommonTransformers(options)
    , pathname(`/admin/fts/${namespace}/tokens/${token}/delete`)
    )

    await fetch(req).then(ok)
  }

  async removeDeleteToken(
    namespace: string
  , token: string
  , options: IFTSManagerRequestOptions = {}
  ): Promise<void> {
    const req = del(
      ...this.getCommonTransformers(options)
    , pathname(`/admin/fts/${namespace}/tokens/${token}/delete`)
    )

    await fetch(req).then(ok)
  }
}
