import Dexie, { Transaction } from 'dexie'
import { Language, Settings, Story, Tag } from './types'

export class AppDatabase extends Dexie {
  stories!: Dexie.Table<Story, number>
  tags!: Dexie.Table<Tag, number>
  settings!: Dexie.Table<Settings, number>

  constructor() {
    super('timeline')
    const db = this

    // provide sample data when create db
    db.populate = db.populate.bind(this)
    db.on('populate', db.populate)

    // add migration from here
    db.version(1).stores({
      stories: '++id',
      tags: '++id, &name',
    })
    db.version(2).upgrade((tx) => {
      tx.table<Story>('stories')
        .toCollection()
        .modify((story) => {
          story.version = 1
          story.createAt = new Date().getTime()
          story.updatedAt = new Date().getTime()

          return story
        })
      tx.table<Tag>('tags')
        .toCollection()
        .modify((tag) => {
          tag.version = 1
          tag.createAt = new Date().getTime()
          tag.updatedAt = new Date().getTime()

          return tag
        })
    })

    db.version(3).stores({ settings: '++id' })
    db.version(4).stores({ stories: '++id, happenedAt' })
  }

  /**
   * Provide sample data
   * Do not use db.transaction here because the transaction will be committed
   * and thus cause DexieTransactionInactiveError.
   * @param tx transaction
   */
  async populate(tx: Transaction) {
    const db = this

    const settings: Settings = {
      lang: 'en',
      theme: 'light',
      isPopulated: false,
    }

    if (window.navigator && window.navigator.language) {
      const supportedLocales: Language[] = ['en', 'zh-TW', 'ja']
      const locale = supportedLocales.find((lang) =>
        new RegExp(`^${lang}\b`).test(navigator.language)
      )
      if (locale !== undefined) {
        settings.lang = locale
      }
    }

    if (
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      settings.theme = 'dark'
    }

    await tx.table('settings').add(settings)

    const tags: Tag[] = [
      {
        name: 'Me',
        color: '#f5b1aa',
        description: 'All memorable and meaningful events in my life',
      },
      {
        name: 'Family',
        color: '#89c3eb',
        description: 'Events for my family',
      },
      {
        name: 'Career',
        color: '#e6b422',
        description: 'Events for my career path',
      },
    ]

    await tx.table('tags').bulkAdd(tags)

    const stories: Story[] = [
      {
        title: 'First day of using Damao Timeline',
        detail: '',
        color: '#fdeff2',
        happenedAt: new Date().getTime(),
        isArchived: false,
        tagIds: [],
      },
    ]

    await tx.table('stories').bulkAdd(stories)
  }
}

export const db = new AppDatabase()
