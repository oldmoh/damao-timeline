import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
  EntityState,
  PayloadAction,
  Update,
} from '@reduxjs/toolkit'
import { RootState } from '../../app/store'
import { db } from '../../app/db'
import { EntityBase } from '../../common/EntityBase'

export interface IStory extends EntityBase {
  id?: number
  title: string
  happenedAt: number
  detail: string
  tagIds: number[]
  color: string
  isArchived: boolean
}

interface TimlineState extends EntityState<IStory> {
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

const storyAdapter = createEntityAdapter<IStory>({
  selectId: (story) => story.id!,
})

const initialState: TimlineState = storyAdapter.getInitialState({
  status: 'idle',
  error: null,
})

export const selectAllStories = createAsyncThunk(
  'timeline/selectAll',
  async (story: void, thunkAPI) => {
    let stories: IStory[] = []
    try {
      stories = await db.transaction(
        'r',
        db.stories,
        db.tags,
        async () => await db.stories.toArray()
      )
    } catch (error) {
      thunkAPI.dispatch(timelineSlice.actions.setError('error message id here'))
    }
    return stories
  }
)

export const insertStory = createAsyncThunk(
  'timeline/insert',
  async (story: IStory, thunkAPI) => {
    // TODO: add validation at here
    story.version = story.version === undefined ? 1 : story.version + 1
    story.createAt = new Date().getTime()
    story.updatedAt = new Date().getTime()
    try {
      await db.transaction('rw', db.stories, async () => {
        const id = await db.stories.add(story)
        story.id = id
      })
    } catch (error) {
      // TODO: add message id
      thunkAPI.rejectWithValue('error message id here')
    }
    return story
  }
)

export const updateStory = createAsyncThunk(
  'timeline/update',
  async (story: IStory, thunkAPI) => {
    try {
      // TODO: add more validation at here
      if (story.id === undefined) {
        // TODO: add message id
        thunkAPI.rejectWithValue('error message id here')
        return story
      }

      story.updatedAt = new Date().getTime()
      story.version = story.version === undefined ? 1 : story.version + 1
      await db.transaction('rw', db.stories, async () => {
        const record = await db.stories.get(story.id!)
        if (record === undefined || record.version === undefined) {
          // TODO: add message id
          thunkAPI.rejectWithValue('error message id here')
          return
        }
        if (story.version! <= record.version) {
          // TODO: add message id
          thunkAPI.rejectWithValue('error message id here')
          return
        }

        const updatedRecordCount: number = await db.stories.update(
          story.id!,
          story
        )
        if (updatedRecordCount === 0) {
          // TODO: add message id
          thunkAPI.rejectWithValue('error message id here')
        }
      })
    } catch (error) {
      // dispatch exception occurred while updaing
      thunkAPI.dispatch(timelineSlice.actions.setError('error message id here'))
    }
    return story
  }
)

export const deleteStory = createAsyncThunk(
  'timeline/delete',
  async (story: IStory, thunkAPI) => {
    if (story.id === undefined) {
      // dispatch validation failed
      // TODO: add message id
      thunkAPI.rejectWithValue('error message id here')
      return story
    }

    try {
      await db.transaction('rw', db.stories, async () => {
        await db.stories.delete(story.id!)
      })
    } catch (error) {
      // TODO: add message id
      thunkAPI.rejectWithValue('error message id here')
    }
    return story
  }
)

const timelineSlice = createSlice({
  name: 'timeline',
  initialState,
  reducers: {
    add: storyAdapter.addOne,
    validate: (state, action: PayloadAction<IStory>) => {},
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload
    },
    toggleLoading: (state, action: PayloadAction<boolean>) => {
      if (action.payload) state.status = 'loading'
      else state.status = 'idle'
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(selectAllStories.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(selectAllStories.fulfilled, (state, action) => {
        state.status = 'succeeded'
        storyAdapter.upsertMany(state, action.payload)
      })
      .addCase(selectAllStories.rejected, (state, action) => {
        state.status = 'failed'
      })
      .addCase(insertStory.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(
        insertStory.fulfilled,
        (state, action: PayloadAction<IStory>) => {
          state.status = 'succeeded'
          storyAdapter.addOne(state, action.payload)
        }
      )
      .addCase(insertStory.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message ?? null
      })
      .addCase(updateStory.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(
        updateStory.fulfilled,
        (state, action: PayloadAction<IStory>) => {
          state.status = 'succeeded'
          const payload = action.payload
          const updatedStory: Update<IStory> = {
            id: payload.id!,
            changes: payload,
          }
          storyAdapter.updateOne(state, updatedStory)
        }
      )
      .addCase(updateStory.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message ?? null
      })
      .addCase(deleteStory.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(
        deleteStory.fulfilled,
        (state, action: PayloadAction<IStory>) => {
          state.status = 'succeeded'
          storyAdapter.removeOne(state, action.payload.id!)
        }
      )
      .addCase(deleteStory.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message ?? null
      })
  },
})

export default timelineSlice.reducer

export const { toggleLoading } = timelineSlice.actions

export const { selectById, selectAll } = storyAdapter.getSelectors<RootState>(
  (state) => state.timeline
)

export const getTimelineStatus = (state: RootState) => state.timeline.status
