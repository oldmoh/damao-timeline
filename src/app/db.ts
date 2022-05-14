import Dexie from 'dexie'
import { ITag } from '../features/tag/tagSlice'
import { IStory } from '../features/timeline/timelineSlice'

export class AppDatabase extends Dexie {
  stories!: Dexie.Table<IStory, number>
  tags!: Dexie.Table<ITag, number>

  constructor() {
    super('timeline')
    let db = this

    // add migration from here
    db.version(1).stores({
      stories: '++id',
      tags: '++id, &name',
    })
    // the follwoing is version 2, 3, etc
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
  }
}

export const db = new AppDatabase()
