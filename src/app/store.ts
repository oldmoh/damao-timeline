import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
import timelineReducer from '../features/timeline/timelineSlice'
import tagReducer from '../features/tag/tagSlice'
import settingsReducer from '../features/settings/settingsSlice'
import notificationSlice from '../features/notification/notificationSlice'

export const store = configureStore({
  reducer: {
    tag: tagReducer,
    timeline: timelineReducer,
    settings: settingsReducer,
    notification: notificationSlice,
  },
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
