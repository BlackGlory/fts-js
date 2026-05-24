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

interface IFTSClientRequestOptions {
  signal?: AbortSignal
  timeout?: number | false
}

class FTSClient {
  static create(options: IFTSClientOptions): Promise<FTSClient>

  close(): Promise<void>

  getNamespaceStats(
    namespace: string
  , signalOrOptions?: AbortSignal | IFTSClientRequestOptions
  ): Promise<INamespaceStats>
  getBucketStats(
    namespace: string
  , bucket: string
  , signalOrOptions?: AbortSignal | IFTSClientRequestOptions
  ): Promise<IBucketStats>

  getAllNamespaces(
    signalOrOptions?: AbortSignal | IFTSClientRequestOptions
  ): Promise<string[]>
  getAllBuckets(
    namespace: string
  , signalOrOptions?: AbortSignal | IFTSClientRequestOptions
  ): Promise<string[]>

  clearBucketsByNamespace(
    namespace: string
  , signalOrOptions?: AbortSignal | IFTSClientRequestOptions
  ): Promise<void>
  clearDocumentsByBucket(
    namespace: string
  , bucket: string
  , signalOrOptions?: AbortSignal | IFTSClientRequestOptions
  ): Promise<void>

  setDocument(
    namespace: string
  , bucket: string
  , documentId: string
  , lexemes: string[]
  , signalOrOptions?: AbortSignal | IFTSClientRequestOptions
  ): Promise<void>

  removeDocument(
    namespace: string
  , bucket: string
  , documentId: string
  , signalOrOptions?: AbortSignal | IFTSClientRequestOptions
  ): Promise<void>

  queryDocuments(
    namespace: string
  , expression: IQueryExpression
  , options?: {
      buckets?: string[]
      limit?: number
      offset?: number
    }
  , signalOrRequestOptions?: AbortSignal | IFTSClientRequestOptions
  ): Promise<IDocumentQueryResult[]>
}
```
