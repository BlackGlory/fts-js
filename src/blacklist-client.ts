import { fetch } from 'extra-fetch'
import { get, put, del } from 'extra-request'
import { pathname, signal } from 'extra-request/transformers/index.js'
import { ok, toJSON } from 'extra-response'
import { IFTSManagerRequestOptions, FTSManagerBase } from './utils'

export class BlacklistClient extends FTSManagerBase {
  /**
   * @throws {AbortError}
   */
  async getNamespaces(options: IFTSManagerRequestOptions = {}): Promise<string[]> {
    const req = get(
      ...this.getCommonTransformers(options)
    , pathname('/admin/blacklist')
    )

    return await fetch(req)
      .then(ok)
      .then(toJSON) as string[]
  }

  /**
   * @throws {AbortError}
   */
  async add(namespace: string, options: IFTSManagerRequestOptions = {}): Promise<void> {
    const req = put(
      ...this.getCommonTransformers(options)
    , pathname(`/admin/blacklist/${namespace}`)
    , options.signal && signal(options.signal)
    )

    await fetch(req).then(ok)
  }

  /**
   * @throws {AbortError}
   */
  async remove(namespace: string, options: IFTSManagerRequestOptions = {}): Promise<void> {
    const req = del(
      ...this.getCommonTransformers(options)
    , pathname(`/admin/blacklist/${namespace}`)
    )

    await fetch(req).then(ok)
  }
}
