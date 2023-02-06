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

  getNamespaceStats(namespace: string, timeout?: number): Promise<INamespaceStats>
  getBucketStats(namespace: string, bucket: string, timeout?: number): Promise<IBucketStats>

  getAllNamespaces(timeout?: number): Promise<string[]>
  getAllBuckets(namespace: string, timeout?: number): Promise<string[]>

  clearBucketsByNamespace(namespace: string, timeout?: number): Promise<void>
  clearDocumentsByBucket(namespace: string, bucket: string, timeout?: number): Promise<void>

  setDocument(
    namespace: string
  , bucket: string
  , documentId: string
  , lexemes: string[]
  , timeout?: number
  ): Promise<void>

  removeDocument(
    namespace: string
  , bucket: string
  , documentId: string
  , timeout?: number
  ): Promise<void>

  queryDocuments(
    namespace: string
  , expression: IQueryExpression
  , options?: {
      buckets?: string[]
      limit?: number
      offset?: number
    }
  , timeout?: number
  ): Promise<IDocumentQueryResult[]>
}
```
