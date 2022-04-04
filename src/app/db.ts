import Dexie from 'dexie'
import { Tag } from '../features/tag/tagSlice'
import { IStory } from '../features/timeline/timelineSlice'

export class AppDatabase extends Dexie {
  stories!: Dexie.Table<IStory, number>
  tags!: Dexie.Table<Tag, number>

  constructor() {
    super('timeline')
    let db = this

    // add migration from here
    db.version(1).stores({
      stories: '++id',
      tags: '++id, &name',
    })
    // the follwoing is version 2, 3, etc
  }
}

export const db = new AppDatabase()
