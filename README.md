# fts-js

## Install

```sh
npm install --save @blackglory/fts-js
# or
yarn add @blackglory/fts-js
```

## API

### FTSClient

```ts
new FTSClient({
  server: string
, token?: string
, basicAuth?: {
    username: string
  , password: string
  }
, keepalive?: boolean
})
```

```ts
interface IFTSClientRequestOptions {
  signal?: AbortSignal
  token?: string
  keepalive?: boolean
}

interface IFTSClientRequestOptionsWithoutToken {
  signal?: AbortSignal
  keepalive?: boolean
}
```

```ts
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
```

#### QueryKeyword

```ts
enum QueryKeyword {
  And
, Or
, Not
, Phrase
, Prefix
}
```

#### set

```ts
FTSClient#set(
  namespace: string
, bucket: string
, id: string
, lexemes: string[]
, options?: IFTSClientRequestOptions
): Promise<void>
```

#### query

```ts
FTSClient#query(
  namespace: string
, query: {
    expression: IQueryExpression
    buckets?: string[]
    limit?: number
  }
, options?: IFTSClientRequestOptions
): Promise<Array<{ bucket: string; id: string }>>
```

#### del

```ts
FTSClient#del(
  namespace: string
, bucket: string
, id: string
, options?: IFTSClientRequestOptions
): Promise<void>
```

#### clearNamespace

```ts
FTSClient#clearNamespace(
  namespace: string
, options?: IFTSClientRequestOptions
): Promise<void>
```

#### clearBucket

```ts
FTSClient#clearBucket(
  namespace: string
, options?: IFTSClientRequestOptions
): Promise<void>
```

#### getNamespaceStats

```ts
FTSClient#getNamespaceStats(
  namespace: string
, options?: IFTSClientRequestOptionsWithoutToken
): Promise<{
  namespace: stirng
  buckets: nubmer
  objects: number
}>
```

#### getBucketStats

```ts
FTSClient#getBucketStats(
  namespace: string
, bucket: string
, options?: IFTSClientRequestOptionsWithoutToken
): Promise<{
  namespace: stirng
  bucket: string
  objects: number
}>
```

#### getAllNamespaces

```ts
FTSClient#getAllNamespaces(options?: IFTSClientRequestOptions): Promise<string[]>
```

#### getAllBuckets

```ts
FTSClient#getAllBuckets(
  namespace: string
, options?: IFTSClientRequestOptions
): Promise<string[]>
```

### FTSManager

```ts
new FTSManager({
  server: string
  adminPassword: string
})
```

```ts
interface IFTSManagerRequestOptions {
  signal?: AbortSignal
}
```

#### Blacklist

##### getNamespaces

```ts
FTSManager#Blacklist.getNamespaces(
  options?: IFTSManagerRequestOptions
): Promise<string[]>
```

##### add

```ts
FTSManager#Blacklist.add(
  namespace: string
, options?: IFTSManagerRequestOptions
): Promise<void>
```

##### remove

```ts
FTSManager#Blacklist.remove(
  namespace: string
, options?: IFTSManagerRequestOptions
): Promise<void>
```

#### Whitelist

##### getNamespaces

```ts
FTSManager#Whitelist.getNamespaces(
  options?: IFTSManagerRequestOptions
): Promise<string[]>
```

##### add

```ts
FTSManager#Whitelist.add(
  namespace: string
, options?: IFTSManagerRequestOptions
): Promise<void>
```

##### remove

```ts
FTSManager#Whitelist.remove(
  namespace: string
, options?: IFTSManagerRequestOptions
): Promise<void>
```

#### TokenPolicy

##### getNamespaces

```ts
FTSManager#TokenPolicy.getNamespaces(
  options?: IFTSManagerRequestOptions
): Promise<string[]>
```

##### get

```ts
FTSManager#TokenPolicy.get(
  namespace: string
, options?: IFTSManagerRequestOptions
): Promise<{
  writeTokenRequired: boolean | null
  queryTokenRequired: boolean | null
  deleteTokenRequired: boolean | null
}>
```

##### setWriteTokenRequired

```ts
FTSManager#TokenPolicy.setWriteTokenRequired(
  namespace: string
, val: boolean
, options?: IFTSManagerRequestOptions
): Promise<void>
```

##### removeWriteTokenRequired

```ts
FTSManager#TokenPolicy.removeWriteTokenRequired(
  namespace: string
, options?: IFTSManagerRequestOptions
): Promise<void>
```

##### setQueryTokenRequired


```ts
FTSManager#TokenPolicy.setQueryTokenRequired(
  namespace: string
, val: boolean
, options?: IFTSManagerRequestOptions
): Promise<void>
```

##### removeQueryTokenRequired

```ts
FTSManager#TokenPolicy.removeQueryTokenRequired(
  namespace: string
, options?: IFTSManagerRequestOptions
): Promise<void>
```

##### setDeleteTokenRequired

```ts
FTSManager#TokenPolicy.setDeleteTokenRequired(
  namespace: string
, val: boolean
, options?: IFTSManagerRequestOptions
): Promise<void>
```

##### removeDeleteTokenRequired

```ts
FTSManager#TokenPolicy.removeDeleteTokenRequired(
  namespace: string
, options?: IFTSManagerRequestOptions
): Promise<void>
```

#### Token

##### getNamespaces

```ts
FTSManager#Token.getNamespaces(options?: IFTSManagerRequestOptions): Promise<string[]>
```

##### getTokens

```ts
FTSManager#Token.getTokens(
  namespace: string
, options?: IFTSManagerRequestOptions
): Promise<Array<{
  token: string
  write: boolean
  query: boolean
  delete: boolean
}>>
```

##### addWriteToken

```ts
FTSManager#Token.addWriteToken(
  namespace: string
, token: string
, options?: IFTSManagerRequestOptions
): Promise<void>
```

##### removeWriteToken

```ts
FTSManager#Token.removeWriteToken(
  namespace: string
, token: string
, options?: IFTSManagerRequestOptions
): Promise<void>
```

##### addQueryToken

```ts
FTSManager#Token.addQueryToken(
  namespace: string
, token: string
, options?: IFTSManagerRequestOptions
): Promise<void>
```

##### removeQueryToken

```ts
FTSManager#Token.removeQueryToken(
  namespace: string
, token: string
, options?: IFTSManagerRequestOptions
): Promise<void>
```

##### addDeleteToken

```ts
FTSManager#Token.addDeleteToken(
  namespace: string
, token: string
, options?: IFTSManagerRequestOptions
): Promise<void>
```

##### removeDeleteToken

```ts
FTSManager#Token.removeDeleteToken(
  namespace: string
, token: string
, options?: IFTSManagerRequestOptions
): Promise<void>
```
