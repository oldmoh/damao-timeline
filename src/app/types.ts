import { AnyAction, AsyncThunk } from '@reduxjs/toolkit'

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
  theme: 'light' | 'dark'
}

export type Language = 'en' | 'zh-TW' | 'ja'

export interface IStoryQueryCriteria {
  from?: number
  to?: number
  order?: 'ascend' | 'descend'
  tags?: number[]
}

export type GenericAsyncThunk = AsyncThunk<unknown, unknown, any>
export type PendingAction = ReturnType<GenericAsyncThunk['pending']>
export function isPendingAction(action: AnyAction): action is PendingAction {
  return action.type.endsWith('/pending')
}

export type RejectedAction = ReturnType<GenericAsyncThunk['rejected']>
export function isRejectedAction(action: AnyAction): action is RejectedAction {
  return action.type.endsWith('/rejected')
}

export interface IValidityState {
  valid: boolean
  error: string | null
}

export interface INotification {
  id?: number | string
  message: string
  type: 'success' | 'error' | 'warning'
}
