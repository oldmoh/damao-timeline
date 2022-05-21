import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
import counterReducer from '../features/counter/counterSlice'
import timelineReducer from '../features/timeline/timelineSlice'
import tagReducer from '../features/tag/tagSlice'
import settingsReducer from '../features/settings/settingsSlice'

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    tag: tagReducer,
    timeline: timelineReducer,
    settings: settingsReducer,
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
