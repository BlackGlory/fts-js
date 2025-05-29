# fts-js
## Install
```sh
npm install --save @blackglory/fts-js
# or
yarn add @blackglory/fts-js
```

## API
```ts
enum QueryKeyword {
  And = 0
, Or = 1
, Not = 2
, Phrase = 3
, Prefix = 4
}

type IQueryExpression =
| ITermExpression
| IPhraseExpression
| IPrefixExpression
| IAndExpression
| IOrExpression
| INotExpression

type ITermExpression = string
type IPhraseExpression = [
  QueryKeyword.Phrase
, ...IQueryExpression[]
]
type IPrefixExpression = [
  QueryKeyword.Prefix
, string
]
type IAndExpression = [
  IQueryExpression
, QueryKeyword.And
, IQueryExpression
]
type IOrExpression = [
  IQueryExpression
, QueryKeyword.Or
, IQueryExpression
]
type INotExpression = [
  QueryKeyword.Not
, IQueryExpression
]

interface IFTSClientOptions {
  server: string
  timeout?: number
  retryIntervalForReconnection?: number
}

class FTSClient {
  static create(options: IFTSClientOptions): Promise<FTSClient>

  close(): Promise<void>

  getNamespaceStats(
    namespace: string
  , signal?: AbortSignal
  ): Promise<INamespaceStats>
  getBucketStats(
    namespace: string
  , bucket: string
  , signal?: AbortSignal
  ): Promise<IBucketStats>

  getAllNamespaces(signal?: AbortSignal): Promise<string[]>
  getAllBuckets(namespace: string, signal?: AbortSignal): Promise<string[]>

  clearBucketsByNamespace(namespace: string, signal?: AbortSignal): Promise<void>
  clearDocumentsByBucket(
    namespace: string
  , bucket: string
  , signal?: AbortSignal
  ): Promise<void>

  setDocument(
    namespace: string
  , bucket: string
  , documentId: string
  , lexemes: string[]
  , signal?: AbortSignal
  ): Promise<void>

  removeDocument(
    namespace: string
  , bucket: string
  , documentId: string
  , signal?: AbortSignal
  ): Promise<void>

  queryDocuments(
    namespace: string
  , expression: IQueryExpression
  , options?: {
      buckets?: string[]
      limit?: number
      offset?: number
    }
  , signal?: AbortSignal
  ): Promise<IDocumentQueryResult[]>
}
```
