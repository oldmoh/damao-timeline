import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { db } from '../../app/db'
import { RootState } from '../../app/store'
import { ISettings, Language } from '../../app/types'

interface SettingsState {
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  settings: ISettings
  error: string | null
}

const initialState: SettingsState = {
  status: 'idle',
  settings: { lang: 'en', theme: 'light' },
  error: null,
}

export const fetchSettings = createAsyncThunk(
  'settings/fetchSettings',
  async (_: void, thunkAPI) => {
    try {
      const settings = await db.transaction('r', db.settings, async () => {
        return await db.settings.toCollection().first()
      })
      if (settings === undefined) return thunkAPI.rejectWithValue('no settings')
      return settings
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  }
)

export const insertSettings = createAsyncThunk(
  'settings/insertSettings',
  async (settings: ISettings, thunkAPI) => {
    try {
      const id = await db.transaction('rw', db.settings, async () => {
        return await db.settings.add(settings)
      })
      settings.id = id
      return settings
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  }
)

export const updateSettings = createAsyncThunk(
  'settings/updateSettings',
  async (settings: ISettings, thunkAPI) => {
    try {
      return await db.transaction('rw', db.settings, async () => {
        const result = await db.settings.update(settings.id!, settings)
        if (result === 0) {
          return thunkAPI.rejectWithValue('Update failed.')
        }
        return settings
      })
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
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
      .addCase(updateSettings.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(updateSettings.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.settings = action.payload
      })
      .addCase(updateSettings.rejected, (state, action) => {
        state.status = 'failed'
        console.log(action)
      })
      .addCase(fetchSettings.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(fetchSettings.fulfilled, (state, action) => {
        state.settings = action.payload
        state.status = 'succeeded'
      })
      .addCase(fetchSettings.rejected, (state, action) => {
        state.status = 'failed'
        console.log(action)
      })
      .addCase(insertSettings.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(insertSettings.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.settings = action.payload
      })
      .addCase(insertSettings.rejected, (state, action) => {
        state.status = 'failed'
        console.log(action)
      })
  },
})

export default settingsSlice.reducer

export const { setLanguage } = settingsSlice.actions
export const getSettingsStatus = (state: RootState) => state.settings.status
export const getSettings = (state: RootState) => state.settings.settings
export const getLanguage = (state: RootState) => state.settings.settings.lang
