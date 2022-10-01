import { fetch } from 'extra-fetch'
import { get, put, del } from 'extra-request'
import { pathname } from 'extra-request/transformers/index.js'
import { ok, toJSON } from 'extra-response'
import { IFTSManagerRequestOptions, Base } from './base'

interface ITokenInfo {
  token: string
  write: boolean
  query: boolean
  delete: boolean
}

export class TokenManager extends Base {
  /**
   * @throws {AbortError}
   */
  async getNamespaces(options: IFTSManagerRequestOptions = {}): Promise<string[]> {
    const req = get(
      ...this.getCommonTransformers(options)
    , pathname('/admin/fts-with-tokens')
    )

    return await fetch(req)
      .then(ok)
      .then(toJSON) as string[]
  }

  /**
   * @throws {AbortError}
   */
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

  /**
   * @throws {AbortError}
   */
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

  /**
   * @throws {AbortError}
   */
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

  /**
   * @throws {AbortError}
   */
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

  /**
   * @throws {AbortError}
   */
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

  /**
   * @throws {AbortError}
   */
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

  /**
   * @throws {AbortError}
   */
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
