import Dexie, { Transaction } from 'dexie'
import { ISettings, IStory, ITag } from './types'

export class AppDatabase extends Dexie {
  stories!: Dexie.Table<IStory, number>
  tags!: Dexie.Table<ITag, number>
  settings!: Dexie.Table<ISettings, number>

  constructor() {
    super('timeline')
    let db = this

    // provide sample data when create db
    db.on('populate', db.populate)

    // add migration from here
    db.version(1).stores({
      stories: '++id',
      tags: '++id, &name',
    })
    db.version(2).upgrade((tx) => {
      tx.table<IStory>('stories')
        .toCollection()
        .modify((story) => {
          story.version = 1
          story.createAt = new Date().getTime()
          story.updatedAt = new Date().getTime()

          return story
        })
      tx.table<ITag>('tags')
        .toCollection()
        .modify((tag) => {
          tag.version = 1
          tag.createAt = new Date().getTime()
          tag.updatedAt = new Date().getTime()

          return tag
        })
    })

    db.version(3).stores({ settings: '++id' })
  }

  /**
   * Provide sample data
   * @param tx transaction
   */
  populate(tx: Transaction) {}
}

export const db = new AppDatabase()
