import { useEffect, useState } from 'react'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'

import { selectAllTags } from '../features/tag/tagSlice'
import type { RootState, AppDispatch } from '../app/store'
import { getLanguage } from '../features/settings/settingsSlice'

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
        setIsInitialized(true)
      } catch (error) {}
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
