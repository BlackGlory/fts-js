import { IHTTPOptionsTransformer } from 'extra-request'
import { url, signal, keepalive, bearerAuth, header } from 'extra-request/transformers/index.js'
import { timeoutSignal, raceAbortSignals } from 'extra-abort'
import type { IFTSManagerOptions } from './fts-manager'
import { Falsy } from 'justypes'

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

export const expectedVersion = '0.3.0'

export class FTSManagerBase {
  constructor(private options: IFTSManagerOptions) {}

  protected getCommonTransformers(
    options: IFTSManagerRequestOptions
  ): Array<IHTTPOptionsTransformer | Falsy> {
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
    , (options.keepalive ?? this.options.keepalive) && keepalive()
    , header('Accept-Version', expectedVersion)
    ]
  }
}
