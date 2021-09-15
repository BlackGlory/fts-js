import { fetch } from 'extra-fetch'
import { get, put, del } from 'extra-request'
import { pathname, json } from 'extra-request/lib/es2018/transformers'
import { ok, toJSON } from 'extra-response'
import { IFTSManagerRequestOptions, FTSManagerBase } from './utils'

interface ITokenPolicy {
  writeTokenRequired: boolean | null
  queryTokenRequired: boolean | null
  deleteTokenRequired: boolean | null
}

export class TokenPolicyClient extends FTSManagerBase {
  async getNamespaces(options: IFTSManagerRequestOptions = {}): Promise<string[]> {
    const req = get(
      ...this.getCommonTransformers(options)
    , pathname('/admin/fts-with-token-policies')
    )

    return await fetch(req)
      .then(ok)
      .then(toJSON) as string[]
  }

  async get(namespace: string, options: IFTSManagerRequestOptions = {}): Promise<ITokenPolicy> {
    const req = get(
      ...this.getCommonTransformers(options)
    , pathname(`/admin/fts/${namespace}/token-policies`)
    )

    return await fetch(req)
      .then(ok)
      .then(toJSON) as ITokenPolicy
  }

  async setWriteTokenRequired(
    namespace: string
  , val: boolean
  , options: IFTSManagerRequestOptions = {}
  ): Promise<void> {
    const req = put(
      ...this.getCommonTransformers(options)
    , pathname(`/admin/fts/${namespace}/token-policies/write-token-required`)
    , json(val)
    )

    await fetch(req).then(ok)
  }

  async removeWriteTokenRequired(
    namespace: string
  , options: IFTSManagerRequestOptions = {}
  ): Promise<void> {
    const req = del(
      ...this.getCommonTransformers(options)
    , pathname(`/admin/fts/${namespace}/token-policies/write-token-required`)
    )

    await fetch(req).then(ok)
  }

  async setQueryTokenRequired(
    namespace: string
  , val: boolean
  , options: IFTSManagerRequestOptions = {}
  ): Promise<void> {
    const req = put(
      ...this.getCommonTransformers(options)
    , pathname(`/admin/fts/${namespace}/token-policies/query-token-required`)
    , json(val)
    )

    await fetch(req).then(ok)
  }

  async removeQueryTokenRequired(
    namespace: string
  , options: IFTSManagerRequestOptions = {}
  ): Promise<void> {
    const req = del(
      ...this.getCommonTransformers(options)
    , pathname(`/admin/fts/${namespace}/token-policies/query-token-required`)
    )

    await fetch(req).then(ok)
  }

  async setDeleteTokenRequired(
    namespace: string
  , val: boolean
  , options: IFTSManagerRequestOptions = {}
  ): Promise<void> {
    const req = put(
      ...this.getCommonTransformers(options)
    , pathname(`/admin/fts/${namespace}/token-policies/delete-token-required`)
    , json(val)
    )

    await fetch(req).then(ok)
  }

  async removeDeleteTokenRequired(
    namespace: string
  , options: IFTSManagerRequestOptions = {}
  ): Promise<void> {
    const req = del(
      ...this.getCommonTransformers(options)
    , pathname(`/admin/fts/${namespace}/token-policies/delete-token-required`)
    )

    await fetch(req).then(ok)
  }
}
