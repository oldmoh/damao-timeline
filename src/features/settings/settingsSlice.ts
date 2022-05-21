import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../../app/store'
import { Language } from '../../app/types'

interface SettingsState {
  lang: Language
}

const initialState: SettingsState = {
  lang: 'en',
}

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<Language>) => {
      state.lang = action.payload
    },
  },
})

export default settingsSlice.reducer

export const { setLanguage } = settingsSlice.actions
export const getSettings = (state: RootState) => state.settings
export const getLanguage = (state: RootState) => state.settings.lang
