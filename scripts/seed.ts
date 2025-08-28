import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { getPayload, Payload } from 'payload'
import payloadConfig from '@payload-config'

const PAGE_SLUG = 'landing-page'
const MEDIA_FILE = '../src/public/Media/coin logo2.png'

const lexical = (text: string) => ({
  root: {
    type: 'root',
    children: [
      {
        type: 'paragraph',
        children: [{ type: 'text', text, version: 1 }],
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
      },
    ],
    direction: 'ltr',
    format: '',
    indent: 0,
    version: 1,
  },
}) as any

async function clearCollections(
  payload: Payload,
  collections: ReadonlyArray<'pages' | 'media'>,
) {
  const counts = await Promise.all(
    collections.map((c) => payload.count({ collection: c })),
  )
  console.log(
    `Clearing: ${collections
      .map((c, i) => `${c}=${counts[i].totalDocs}`)
      .join(', ')}`,
  )
  for (const c of collections) {
    await payload.delete({
      collection: c,
      where: { id: { exists: true } },
    } as any)
  }
  const after = await Promise.all(
    collections.map((c) => payload.count({ collection: c })),
  )
  console.log(
    `After clear: ${collections
      .map((c, i) => `${c}=${after[i].totalDocs}`)
      .join(', ')}`,
  )
}

async function uploadSeedMedia(payload: Payload): Promise<string> {
  const seedMediaPath = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    MEDIA_FILE,
  )
  if (!fs.existsSync(seedMediaPath)) {
    throw new Error(`Seed media not found at ${seedMediaPath}`)
  }
  const doc = await payload.create({
    collection: 'media',
    data: { alt: 'Coin logo' },
    filePath: seedMediaPath,
  })
  return doc.id as string
}

async function upsertLandingPage(payload: Payload, imageId: string) {
  const existing = await payload.find({
    collection: 'pages',
    where: { slug: { equals: PAGE_SLUG } },
    limit: 1,
  })
  const data = {
    title: 'Landing Page',
    slug: PAGE_SLUG,
    layout: [
      {
        blockType: 'hero',
        heading: 'This is The demo payload cms',
        subheading: lexical('Build rich pages with Payload blocks.'),
        image: imageId,
        cta_button: { label: 'Get Started', url: '/get-started' },
      },
      {
        blockType: 'content',
        heading: 'About',
        content: lexical(
          'This page was seeded. Edit blocks in the admin to see how it works.',
        ),
      },
    ],
  }
  if (existing.docs?.length) {
    await payload.update({
      collection: 'pages',
      id: existing.docs[0].id,
      data: data as any,
    })
  } else {
    await payload.create({ collection: 'pages', data: data as any })
  }
}

async function main() {
  const config = await payloadConfig
  const payload = await getPayload({ config })

  const COLLECTIONS_TO_CLEAR = ['pages', 'media'] as const
  await clearCollections(payload, COLLECTIONS_TO_CLEAR)
  const mediaId = await uploadSeedMedia(payload)
  await upsertLandingPage(payload, mediaId)

  console.log('Seed complete')
  process.exit(0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
