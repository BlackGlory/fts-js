import { FTSClient } from '@src/fts-client.js'

const server = 'ws://fts:8080'

describe('FTSClient', () => {
  test('setDocument, queryDocuments', async () => {
    const client = await FTSClient.create({ server })

    try {
      await client.setDocument('namespace', 'bucket', 'document-id', ['lexeme'])
      const result = await client.queryDocuments('namespace', 'lexeme')

      expect(result).toStrictEqual([
        {
          bucket: 'bucket'
        , documentId: 'document-id'
        }
      ])
    } finally {
      await client.clearBucketsByNamespace('namespace')
      await client.close()
    }
  })
})
