import {
  createEntityAdapter,
  createSelector,
  createSlice,
  nanoid,
  PayloadAction,
} from '@reduxjs/toolkit'

import { RootState } from '../../app/store'
import { INotification, isRejectedAction } from '../../app/types'

const notificationAdapter = createEntityAdapter<INotification>({
  selectId: (message) => message.id!,
})

const notificationSlice = createSlice({
  name: 'notification',
  initialState: notificationAdapter.getInitialState({}),
  reducers: {
    push: (state, action: PayloadAction<INotification>) =>
      notificationAdapter.addOne(state, {
        ...action.payload,
        id: parseInt(nanoid()),
      }),
    pop: notificationAdapter.removeOne,
  },
  extraReducers: (builder) => {
    builder.addMatcher(isRejectedAction, (state, action) => {
      // notificationAdapter.addOne(state, {
      //   id: parseInt(nanoid()),
      //   message: action.payload as string,
      //   type: 'error',
      // })
    })
  },
})

export default notificationSlice.reducer

export const { pop, push } = notificationSlice.actions

export const selectFirstNotification = createSelector(
  (state: RootState) => {
    return notificationAdapter.getSelectors().selectAll(state.notification)
  },
  (notifications) => {
    return notifications.length === 0 ? undefined : notifications[0]
  }
)
