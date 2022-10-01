# fts-js
## Install
```sh
npm install --save @blackglory/fts-js
# or
yarn add @blackglory/fts-js
```

## API
```ts
interface IFTSClientOptions {
  server: string
  token?: string
  basicAuth?: {
    username: string
    password: string
  }
  keepalive?: boolean
  timeout?: number
}

interface IFTSClientRequestOptions {
  signal?: AbortSignal
  token?: string
  keepalive?: boolean
  timeout?: number | false
}

interface IFTSClientRequestOptionsWithoutToken {
  signal?: AbortSignal
  keepalive?: boolean
  timeout?: number | false
}

type IQueryExpression =
| IWordExpression
| IPhraseExpression
| IPrefixExpression
| IAndExpression
| IOrExpression
| INotExpression

type IWordExpression = string
type IPhraseExpression = [QueryKeyword.Phrase, ...IQueryExpression[]]
type IPrefixExpression = [QueryKeyword.Prefix, string]
type IAndExpression = [IQueryExpression, QueryKeyword.And, IQueryExpression]
type IOrExpression = [IQueryExpression, QueryKeyword.Or, IQueryExpression]
type INotExpression = [QueryKeyword.Not, IQueryExpression]

interface IQueryResult {
  bucket: string
  id: string
}

class FTSClient {
  constructor(options: IFTSClientOptions)

  set(
    namespace: string
  , bucket: string
  , id: string
  , lexemes: string[]
  , options: IFTSClientRequestOptions = {}
  ): Promise<void>

  query(
    namespace: string
  , query: {
      expression: IQueryExpression
      buckets?: string[]
      limit?: number
      offset?: number
    }
  , options: IFTSClientRequestOptions = {}
  ): Promise<IQueryResult[]>

  del(
    namespace: string
  , bucket: string
  , id: string
  , options: IFTSClientRequestOptions = {}
  ): Promise<void>

  clearNamespace(
    namespace: string
  , options: IFTSClientRequestOptions = {}
  ): Promise<void>

  clearBucket(
    namespace: string
  , bucket: string
  , options: IFTSClientRequestOptions = {}
  ): Promise<void>

  getNamespaceStats(
    namespace: string
  , options: IFTSClientRequestOptionsWithoutToken = {}
  ): Promise<{ namespace: string; objects: number }>

  getBucketStats(
    namespace: string
  , bucket: string
  , options: IFTSClientRequestOptionsWithoutToken = {}
  ): Promise<{ namespace: string; objects: number }>

  getAllNamespaces(
    options: IFTSClientRequestOptionsWithoutToken = {}
  ): Promise<string[]>

  getAllBuckets(
    namespace: string
  , options: IFTSClientRequestOptionsWithoutToken = {}
  ): Promise<string[]>
}
```

### FTSManager
```ts
interface IFTSManagerRequestOptions {
  signal?: AbortSignal
  keepalive?: boolean
  timeout?: number | false
}

interface IFTSManagerOptions {
  server: string
  adminPassword: string
  keepalive?: boolean
  timeout?: number
}

class FTSManager {
  constructor(options: IFTSManagerOptions)

  Blacklist: BlacklistManager
  Whitelist: WhitelistManager
  TokenPolicy: TokenPolicyManager
  Token: TokenManager
}
```

#### BlacklistManager
```ts
class BlacklistManager {
  getNamespaces(options: IFTSManagerRequestOptions = {}): Promise<string[]>
  add(namespace: string, options: IFTSManagerRequestOptions = {}): Promise<void>
  remove(namespace: string, options: IFTSManagerRequestOptions = {}): Promise<void>
}
```

#### WhitelistManager
```ts
class WhitelistManager {
  getNamespaces(options: IFTSManagerRequestOptions = {}): Promise<string[]>
  add(namespace: string, options: IFTSManagerRequestOptions = {}): Promise<void>
  remove(namespace: string, options: IFTSManagerRequestOptions = {}): Promise<void>
}
```

#### TokenPolicyManager
```ts
interface ITokenPolicy {
  writeTokenRequired: boolean | null
  queryTokenRequired: boolean | null
  deleteTokenRequired: boolean | null
}

class TokenPolicyManager {
  getNamespaces(options: IFTSManagerRequestOptions = {}): Promise<string[]>
  get(
    namespace: string
  , options: IFTSManagerRequestOptions = {}
  ): Promise<ITokenPolicy> 
  setWriteTokenRequired(
    namespace: string
  , val: boolean
  , options: IFTSManagerRequestOptions = {}
  ): Promise<void>
  removeWriteTokenRequired(
    namespace: string
  , options: IFTSManagerRequestOptions = {}
  ): Promise<void>
  setQueryTokenRequired(
    namespace: string
  , val: boolean
  , options: IFTSManagerRequestOptions = {}
  ): Promise<void>
  removeQueryTokenRequired(
    namespace: string
  , options: IFTSManagerRequestOptions = {}
  ): Promise<void>
  setDeleteTokenRequired(
    namespace: string
  , val: boolean
  , options: IFTSManagerRequestOptions = {}
  ): Promise<void>
  removeDeleteTokenRequired(
    namespace: string
  , options: IFTSManagerRequestOptions = {}
  ): Promise<void>
}
```

#### TokenManager
```ts
interface ITokenInfo {
  token: string
  write: boolean
  query: boolean
  delete: boolean
}

class TokenManager {
  getNamespaces(options: IFTSManagerRequestOptions = {}): Promise<string[]>
  getTokens(
    namespace: string
  , options: IFTSManagerRequestOptions = {}
  ): Promise<ITokenInfo[]>
  addWriteToken(
    namespace: string
  , token: string
  , options: IFTSManagerRequestOptions = {}
  ): Promise<void>
  removeWriteToken(
    namespace: string
  , token: string
  , options: IFTSManagerRequestOptions = {}
  ): Promise<void>
  addQueryToken(
    namespace: string
  , token: string
  , options: IFTSManagerRequestOptions = {}
  ): Promise<void>
  removeQueryToken(
    namespace: string
  , token: string
  , options: IFTSManagerRequestOptions = {}
  ): Promise<void>
  addDeleteToken(
    namespace: string
  , token: string
  , options: IFTSManagerRequestOptions = {}
  ): Promise<void>
  removeDeleteToken(
    namespace: string
  , token: string
  , options: IFTSManagerRequestOptions = {}
  ): Promise<void>
}
```
