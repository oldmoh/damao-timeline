import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../common/hooks'
import { pop, selectFirstNotification } from './notificationSlice'

export const useNotification = () => {
  const dispatch = useAppDispatch()
  const notification = useAppSelector(selectFirstNotification)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (notification !== undefined) setIsOpen(true)
  }, [notification])

  return {
    isOpen,
    notification,
    close: () => setIsOpen(false),
    popNotification: () => dispatch(pop(notification?.id ?? 0)),
  }
}
