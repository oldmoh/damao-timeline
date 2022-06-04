import { useEffect, useState } from 'react'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'

import { selectAllTags } from '../features/tag/tagSlice'
import type { RootState, AppDispatch } from '../app/store'
import {
  fetchSettings,
  getLanguage,
  getSettings,
  insertSettings,
} from '../features/settings/settingsSlice'
import { ISettings, Language } from '../app/types'

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
export const useInitializer = () => {
  const dispatch = useAppDispatch()
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    const initialize = async () => {
      try {
        await dispatch(selectAllTags())
      } catch (error) {
        console.log(error)
      }

      let hasSettings = false
      try {
        await dispatch(fetchSettings()).unwrap()
        hasSettings = true
        //setIsInitialized(true)
      } catch (error) {
        if (typeof error === 'string' && error === 'no settings') {
          hasSettings = false
        } else {
          console.log(error)
        }
      }

      if (hasSettings) {
        setIsInitialized(true)
        return
      }

      try {
        let settings: ISettings = { lang: 'en', theme: 'light' }
        if (window.navigator && window.navigator.language) {
          const supportedLocales: Language[] = ['en', 'zh-TW', 'ja']
          const locale = supportedLocales.find((lang) =>
            new RegExp(`^${lang}\b`).test(navigator.language)
          )
          if (locale !== undefined) settings.lang = locale
        }
        if (
          window.matchMedia &&
          window.matchMedia('(prefers-color-scheme: dark)').matches
        ) {
          settings.theme = 'dark'
        }
        await dispatch(insertSettings(settings))
      } catch (error) {
        console.log(error)
      }

      setIsInitialized(true)
    }
    initialize()
  }, [])

  return isInitialized
}

/**
 * Provide i18n messages according to the global state locale
 * @returns i18n messages
 */
export const useI18n = () => {
  const locale = useAppSelector(getLanguage)
  const [messages, setMessages] = useState<any>(undefined)

  useEffect(() => {
    const loadMessages = async () => {
      switch (locale) {
        case 'en':
          setMessages(await import('../compiled-lang/en.json'))
          break
        case 'zh-TW':
          setMessages(await import('../compiled-lang/zh-TW.json'))
          break
        case 'ja':
          setMessages(await import('../compiled-lang/ja.json'))
          break
        default:
          setMessages(await import('../compiled-lang/en.json'))
      }
    }
    loadMessages()
  }, [locale])

  return messages
}
