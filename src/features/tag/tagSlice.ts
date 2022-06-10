import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
  EntityState,
  PayloadAction,
  Update,
} from '@reduxjs/toolkit'
import { db } from '../../app/db'
import { RootState } from '../../app/store'
import { isPendingAction, Tag } from '../../app/types'

interface TagState extends EntityState<Tag> {
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

const tagAdapter = createEntityAdapter<Tag>({
  selectId: (tag) => tag.id!,
})

const initialState: TagState = tagAdapter.getInitialState({
  status: 'idle',
  error: null,
})

export const selectAllTags = createAsyncThunk(
  'tag/selectAll',
  async (tag: void, thunkAPI) => {
    let tags: Tag[] = []
    try {
      tags = await db.transaction(
        'r',
        db.tags,
        async () => await db.tags.toArray()
      )
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
    return tags
  }
)

export const fetchTagById = createAsyncThunk(
  'tag/fetchById',
  async (id: number, thunkAPI) => {
    try {
      return await db.transaction(
        'r',
        db.tags,
        async () => await db.tags.get(id)
      )
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  }
)

export const insertTag = createAsyncThunk(
  'tag/insert',
  async (tag: Tag, thunkAPI) => {
    tag.version = tag.version === undefined ? 1 : tag.version + 1
    tag.createAt = new Date().getTime()
    tag.updatedAt = new Date().getTime()
    try {
      await db.transaction('rw', db.tags, async () => {
        const id = await db.tags.add(tag)
        tag.id = id
      })
      return tag
    } catch (error) {
      return thunkAPI.rejectWithValue('error message id here')
    }
  }
)

export const updateTag = createAsyncThunk(
  'tag/update',
  async (tag: Tag, thunkAPI) => {
    try {
      if (tag.id === undefined) {
        return thunkAPI.rejectWithValue('Tag id is missing.')
      }

      tag.updatedAt = new Date().getTime()
      tag.version = tag.version === undefined ? 1 : tag.version + 1
      await db.transaction('rw', db.tags, async () => {
        const record = await db.tags.get(tag.id!)
        if (record === undefined || record.version === undefined) {
          return thunkAPI.rejectWithValue('Tag does not exist.')
        }
        if (tag.version === record.version) {
          return thunkAPI.rejectWithValue('Optimistic lock is hanged.')
        }

        const updatedRecordCount: number = await db.tags.update(tag.id!, tag)
        if (updatedRecordCount === 0) {
          return thunkAPI.rejectWithValue('Update failed.')
        }
      })
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
    return tag
  }
)

export const deleteTag = createAsyncThunk(
  'tag/delete',
  async (tag: Tag, thunkAPI) => {
    if (tag.id === undefined) {
      return thunkAPI.rejectWithValue('Tag id is missing.')
    }

    try {
      await db.transaction('rw', db.tags, async () => {
        await db.tags.delete(tag.id!)
      })
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
    return tag
  }
)

const tagSlice = createSlice({
  name: 'tag',
  initialState,
  reducers: {
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(selectAllTags.fulfilled, (state, action) => {
        state.status = 'succeeded'
        tagAdapter.upsertMany(state, action.payload)
      })
      .addCase(selectAllTags.rejected, (state, action) => {
        state.status = 'failed'
      })
      .addCase(insertTag.fulfilled, (state, action: PayloadAction<Tag>) => {
        state.status = 'succeeded'
        tagAdapter.addOne(state, action.payload)
      })
      .addCase(insertTag.rejected, (state, action) => {
        state.status = 'failed'
      })
      .addCase(updateTag.fulfilled, (state, action: PayloadAction<Tag>) => {
        state.status = 'succeeded'
        const payload = action.payload
        const updatedTag: Update<Tag> = {
          id: payload.id!,
          changes: payload,
        }
        tagAdapter.updateOne(state, updatedTag)
      })
      .addCase(updateTag.rejected, (state, action) => {
        state.status = 'failed'
      })
      .addCase(deleteTag.fulfilled, (state, action: PayloadAction<Tag>) => {
        state.status = 'succeeded'
        tagAdapter.removeOne(state, action.payload.id!)
      })
      .addCase(deleteTag.rejected, (state, action) => {
        state.status = 'failed'
      })
      .addCase(fetchTagById.fulfilled, (state, action) => {
        state.status = 'succeeded'
        if (action.payload) tagAdapter.upsertOne(state, action.payload)
      })
      .addCase(fetchTagById.rejected, (state, action) => {
        state.status = 'failed'
      })
      .addMatcher(isPendingAction, (state, action) => {
        state.status = 'loading'
      })
  },
})

// export const { add } = tagSlice.actions

export default tagSlice.reducer

export const { selectById, selectAll } = tagAdapter.getSelectors<RootState>(
  (state) => state.tag
)

export const getTagStatus = (state: RootState) => state.tag.status
export const getErrorMessage = (state: RootState) => state.tag.error
