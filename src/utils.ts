import { IHTTPOptions, IHTTPOptionsTransformer } from 'extra-request'
import { Headers } from 'extra-fetch'

export function password(password: string): IHTTPOptionsTransformer {
  return (options: IHTTPOptions) => {
    const headers = new Headers(options.headers)
    headers.set('Authorization', `Bearer ${password}`)
    return {
      ...options
    , headers
    }
  }
}
