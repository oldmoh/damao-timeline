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
import { StoryQueryCriteria, Story, isPendingAction } from '../../app/types'

interface TimlineState extends EntityState<Story> {
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
  totalCount: number
  queryCriteria: StoryQueryCriteria
  story?: Story
}

const storyAdapter = createEntityAdapter<Story>({
  selectId: (story) => story.id!,
})

const initialState: TimlineState = storyAdapter.getInitialState({
  status: 'idle',
  error: null,
  totalCount: 0,
  queryCriteria: {
    order: 'descend',
  },
})

export const fetchStories = createAsyncThunk<
  Story[],
  void,
  { state: RootState }
>('timeline/fetchStories', async (_, thunkAPI) => {
  const criteria = thunkAPI.getState().timeline.queryCriteria
  return await db.transaction('r', db.stories, db.tags, async (tx) => {
    let collection = db.stories.orderBy('happenedAt')
    collection.filter((story) => {
      const happenedAt = new Date(story.happenedAt)
      if (criteria.from && happenedAt < new Date(criteria.from)) return false
      if (criteria.to && happenedAt > new Date(criteria.to)) return false

      return true
    })
    if (criteria.order === 'descend') collection = collection.reverse()

    let limit = 5
    let offset = thunkAPI.getState().timeline.ids.length
    return await collection.offset(offset).limit(limit).toArray()
  })
})

export const countStories = createAsyncThunk<
  number,
  void,
  { state: RootState }
>('timeline/countStories', async (_, thunkAPI) => {
  const criteria = thunkAPI.getState().timeline.queryCriteria
  return await db.transaction('r', db.stories, async (tx) => {
    return await db.stories
      .filter((story) => {
        const happenedAt = new Date(story.happenedAt)
        if (criteria.from && happenedAt < new Date(criteria.from)) return false
        if (criteria.to && happenedAt > new Date(criteria.to)) return false

        return true
      })
      .count()
  })
})

export const fetchStoryById = createAsyncThunk(
  'timeline/fetchById',
  async (id: number, thunkAPI) => {
    return await db.transaction('r', db.stories, async () => db.stories.get(id))
  }
)

export const insertStory = createAsyncThunk(
  'timeline/insert',
  async (story: Story, thunkAPI) => {
    story.version = story.version === undefined ? 1 : story.version + 1
    story.createAt = new Date().getTime()
    story.updatedAt = new Date().getTime()
    await db.transaction('rw', db.stories, async () => {
      const id = await db.stories.add(story)
      story.id = id
    })
    return story
  }
)

export const updateStory = createAsyncThunk<Story, Story, { state: RootState }>(
  'timeline/update',
  async (story: Story, thunkAPI) => {
    if (story.id === undefined) {
      return thunkAPI.rejectWithValue('Story id is missing.')
    }
    story.updatedAt = new Date().getTime()
    story.version = story.version === undefined ? 1 : story.version + 1
    await db.transaction('rw', db.stories, async () => {
      const record = await db.stories.get(story.id!)
      if (record === undefined || record.version === undefined) {
        return thunkAPI.rejectWithValue('Story does not exist.')
      }
      if (story.version! <= record.version) {
        return thunkAPI.rejectWithValue('Optimisitc lock is hanged.')
      }
      const updatedRecordCount: number = await db.stories.update(
        story.id!,
        story
      )
      if (updatedRecordCount === 0) {
        return thunkAPI.rejectWithValue('Update failed.')
      }
    })

    return story
  }
)

export const deleteStory = createAsyncThunk(
  'timeline/delete',
  async (story: Story, thunkAPI) => {
    if (story.id === undefined) {
      return thunkAPI.rejectWithValue('Story id is missing.')
    }

    await db.transaction('rw', db.stories, async () => {
      await db.stories.delete(story.id!)
    })
    return story
  }
)

const timelineSlice = createSlice({
  name: 'timeline',
  initialState,
  reducers: {
    add: storyAdapter.addOne,
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload
    },
    clear: storyAdapter.removeAll,
  },
  extraReducers: (builder) => {
    builder
      .addCase(insertStory.fulfilled, (state, action: PayloadAction<Story>) => {
        state.status = 'succeeded'
      })
      .addCase(insertStory.rejected, (state, action) => {
        state.status = 'failed'
      })
      .addCase(updateStory.fulfilled, (state, action: PayloadAction<Story>) => {
        state.status = 'succeeded'
        const payload = action.payload
        const updatedStory: Update<Story> = {
          id: payload.id!,
          changes: payload,
        }
        if (state.ids.includes(payload.id!)) {
          storyAdapter.updateOne(state, updatedStory)
        }
      })
      .addCase(updateStory.rejected, (state, action) => {
        state.status = 'failed'
      })
      .addCase(deleteStory.fulfilled, (state, action: PayloadAction<Story>) => {
        state.status = 'succeeded'
        storyAdapter.removeOne(state, action.payload.id!)
      })
      .addCase(deleteStory.rejected, (state, action) => {
        state.status = 'failed'
      })
      .addCase(fetchStoryById.fulfilled, (state, action) => {
        state.status = 'succeeded'
        if (action.payload && state.ids.includes(action.payload.id!)) {
          storyAdapter.upsertOne(state, action.payload)
          state.story = action.payload
        }
      })
      .addCase(fetchStoryById.rejected, (state, action) => {
        state.status = 'failed'
      })
      .addCase(fetchStories.fulfilled, (state, action) => {
        state.status = 'succeeded'
        storyAdapter.setMany(state, action.payload)
      })
      .addCase(fetchStories.rejected, (state, action) => {
        state.status = 'failed'
      })
      .addCase(countStories.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.totalCount = action.payload
      })
      .addCase(countStories.rejected, (state, action) => {
        state.status = 'failed'
      })
      .addMatcher(isPendingAction, (state, action) => {
        state.status = 'loading'
      })
  },
})

export default timelineSlice.reducer

export const { selectById, selectAll } = storyAdapter.getSelectors<RootState>(
  (state) => state.timeline
)

export const { clear } = timelineSlice.actions

export const getTimelineStatus = (state: RootState) => state.timeline.status
export const getErrorMessage = (state: RootState) => state.timeline.error
export const getTotalCount = (state: RootState) => state.timeline.totalCount
export const getQueryCriteria = (state: RootState) =>
  state.timeline.queryCriteria
