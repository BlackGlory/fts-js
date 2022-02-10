import { IHTTPOptionsTransformer } from 'extra-request'
import { url, signal, keepalive, bearerAuth, header } from 'extra-request/transformers/index.js'
import { timeoutSignal, raceAbortSignals } from 'extra-abort'
import type { IFTSManagerOptions } from './fts-manager'

export enum QueryKeyword {
  And = 0
, Or = 1
, Not = 2
, Phrase = 3
, Prefix = 4
}

export interface IFTSManagerRequestOptions {
  signal?: AbortSignal
  keepalive?: boolean
  timeout?: number | false
}

export const expectedVersion = '0.2.6'

export class FTSManagerBase {
  constructor(private options: IFTSManagerOptions) {}

  protected getCommonTransformers(
    options: IFTSManagerRequestOptions
  ): IHTTPOptionsTransformer[] {
    return [
      url(this.options.server)
    , bearerAuth(this.options.adminPassword)
    , signal(raceAbortSignals([
        options.signal
      , options.timeout !== false && (
          (options.timeout && timeoutSignal(options.timeout)) ??
          (this.options.timeout && timeoutSignal(this.options.timeout))
        )
      ]))
    , keepalive(options.keepalive ?? this.options.keepalive)
    , header('Accept-Version', expectedVersion)
    ]
  }
}
