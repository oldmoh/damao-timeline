import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
  EntityState,
  PayloadAction,
} from '@reduxjs/toolkit'
import { RootState } from '../../app/store'
import { Tag } from '../tag/tagSlice'
import { db } from '../../app/db'

export interface TimelineEvent {
  id?: number
  title: string
  happenedAt: string
  detail: string
  tagIds: number[]
  color: string
  isArchived: boolean
}

interface TimlineState extends EntityState<TimelineEvent> {
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

const eventAdapter = createEntityAdapter<TimelineEvent>({
  selectId: (event) => event.id!,
})

const initialState: TimlineState = eventAdapter.getInitialState({
  status: 'idle',
  error: null,
})

export const insertEvent = createAsyncThunk(
  'timeline/insert',
  async (event: TimelineEvent, thunkAPI) => {
    try {
      await db.transaction('rw', db.events, async () => {
        const id = await db.events.add(event)
        event.id = id
      })
      return event
    } catch (error) {
      return event
    }
  }
)

export const updateEvent = createAsyncThunk(
  'timeline/update',
  async (event: TimelineEvent, thunkAPI) => {
    try {
      // validate before update
      // thunkAPI.dispatch(timelineSlice.actions.validate(event))
      // const rootState = thunkAPI.getState()
      // rootState.timeline.status
      let updatedRecordCount: number = 0
      await db.transaction('rw', db.events, async () => {
        updatedRecordCount = await db.events.update(event.id!, event)
      })

      // check update result
      if (updatedRecordCount === 0) {
      }
      return event
    } catch (error) {
      return event
    }
  }
)

export const selectAllEvents = createAsyncThunk(
  'timeline/selectAll',
  async (event: TimelineEvent, thunkAPI) => {
    let events: TimelineEvent[] = []
    try {
      events = await db.transaction('r', db.events, db.tags, async () => {
        return await db.events.toArray()
      })
      events = await Promise.all(
        events.map(async (item) => {
          //
          // item.tags = await db.tags.where('id').anyOf(item.tagIds).toArray()
          return item
        })
      )
      return events
    } catch (error) {
      return events
    }
  }
)

const timelineSlice = createSlice({
  name: 'timeline',
  initialState,
  reducers: {
    add: eventAdapter.addOne,
    validate: (state, action: PayloadAction<TimelineEvent>) => {
      let event: TimelineEvent = action.payload
      if (event.id === undefined) {
        state.status = 'failed'
        state.error = 'No id'
      } else {
        state.status = 'idle'
        state.error = null
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(
        insertEvent.fulfilled,
        (state, action: PayloadAction<TimelineEvent>) => {
          state.status = 'succeeded'
          eventAdapter.addOne(state, action.payload)
        }
      )
      .addCase(selectAllEvents.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(selectAllEvents.fulfilled, (state, action) => {
        state.status = 'succeeded'
      })
  },
})

export default timelineSlice.reducer

export const { selectById, selectAll } = eventAdapter.getSelectors<RootState>(
  (state) => state.timeline
)
