export interface EntityBase {
  version?: number
  createAt?: number
  updatedAt?: number
}

export interface IStory extends EntityBase {
  id?: number
  title: string
  happenedAt: number
  detail: string
  tagIds: number[]
  color: string
  isArchived: boolean
}

export interface ITag extends EntityBase {
  id?: number
  name: string
  description: string
  color: string
}

export type Language = 'en' | 'zh-TW' | 'ja'
