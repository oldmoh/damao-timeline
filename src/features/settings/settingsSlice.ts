import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { db } from '../../app/db'
import { RootState } from '../../app/store'
import {
  Settings,
  isPendingAction,
  Language,
  isRejectedAction,
} from '../../app/types'

interface SettingsState {
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  settings: Settings
  error: string | null
}

const initialState: SettingsState = {
  status: 'idle',
  settings: { lang: 'en', theme: 'light', isPopulated: false },
  error: null,
}

export const fetchSettings = createAsyncThunk(
  'settings/fetchSettings',
  async (_: void, thunkAPI) => {
    const settings = await db.transaction('r', db.settings, async () => {
      return await db.settings.toCollection().first()
    })
    if (settings === undefined) return thunkAPI.rejectWithValue('no settings')
    return settings
  }
)

export const updateSettings = createAsyncThunk(
  'settings/updateSettings',
  async (settings: Settings, thunkAPI) => {
    return await db.transaction('rw', db.settings, async () => {
      const result = await db.settings.update(settings.id!, settings)
      if (result === 0) {
        return thunkAPI.rejectWithValue('Update failed.')
      }
      return settings
    })
  }
)

export const resetDatabase = createAsyncThunk(
  'settings/reset',
  async (params, thunkAPI) => {
    await db.delete()
    await db.open()
    const settings = await db.transaction('rw', db.settings, async () => {
      return await db.settings.toCollection().first()
    })
    if (settings === undefined) return thunkAPI.rejectWithValue('no settings')
    return settings
  }
)

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<Language>) => {
      if (state.settings !== undefined) state.settings.lang = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateSettings.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.settings = action.payload
      })
      .addCase(fetchSettings.fulfilled, (state, action) => {
        state.settings = action.payload
        state.status = 'succeeded'
      })
      .addCase(resetDatabase.fulfilled, (state, action) => {
        state.settings = action.payload
        state.status = 'succeeded'
      })

      .addMatcher(isPendingAction, (state, action) => {
        state.status = 'loading'
      })
      .addMatcher(isRejectedAction, (state, action) => {
        state.status = 'failed'
        console.error(action.error)
      })
  },
})

export default settingsSlice.reducer

export const { setLanguage } = settingsSlice.actions
export const getSettingsStatus = (state: RootState) => state.settings.status
export const getSettings = (state: RootState) => state.settings.settings
export const getLanguage = (state: RootState) => state.settings.settings.lang
