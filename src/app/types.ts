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

export interface ISettings extends EntityBase {
  id?: number
  lang: Language
}

export type Language = 'en' | 'zh-TW' | 'ja'

export interface IStoryQueryCriteria {
  from?: number
  to?: number
  order?: 'ascend' | 'descend'
  tags?: number[]
}
