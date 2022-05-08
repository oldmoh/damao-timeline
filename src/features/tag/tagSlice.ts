import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
  EntityState,
  nanoid,
  PayloadAction,
  Update,
} from '@reduxjs/toolkit'
import { db } from '../../app/db'
import { RootState } from '../../app/store'

export interface ITag {
  id?: number
  name: string
  description: string
  color: string
}

interface TagState extends EntityState<ITag> {
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

const tagAdapter = createEntityAdapter<ITag>({
  selectId: (tag) => tag.id!,
})

const initialState: TagState = tagAdapter.getInitialState({
  status: 'idle',
  error: null,
})

export const selectAllTags = createAsyncThunk(
  'tag/selectAll',
  async (tag: void, thunkAPI) => {
    let tags: ITag[] = []
    try {
      tags = await db.transaction(
        'r',
        db.tags,
        async () => await db.tags.toArray()
      )
    } catch (error) {
      thunkAPI.dispatch(tagSlice.actions.setError('error message id here'))
    }
    return tags
  }
)

export const insertTag = createAsyncThunk(
  'tag/insert',
  async (tag: ITag, thunkAPI) => {
    try {
      await db.transaction('rw', db.tags, async () => {
        const id = await db.tags.add(tag)
        tag.id = id
      })
      return tag
    } catch (error) {
      return tag
    }
  }
)

export const updateTag = createAsyncThunk(
  'tag/update',
  async (tag: ITag, thunkAPI) => {
    try {
      // TODO: add more validation at here
      if (tag.id === undefined) {
        // TODO: add message id
        thunkAPI.rejectWithValue('error message id here')
        return tag
      }
      let updatedRecordCount: number = 0
      await db.transaction('rw', db.tags, async () => {
        updatedRecordCount = await db.tags.update(tag.id!, tag)
      })

      if (updatedRecordCount === 0) {
        // TODO: add message id
        thunkAPI.rejectWithValue('error message id here')
      }
    } catch (error) {
      // dispatch exception occurred while updaing
      thunkAPI.dispatch(tagSlice.actions.setError('error message id here'))
    }
    return tag
  }
)

export const deleteTag = createAsyncThunk(
  'tag/delete',
  async (tag: ITag, thunkAPI) => {
    if (tag.id === undefined) {
      // dispatch validation failed
      // TODO: add message id
      thunkAPI.rejectWithValue('error message id here')
      return tag
    }

    try {
      await db.transaction('rw', db.tags, async () => {
        await db.tags.delete(tag.id!)
      })
    } catch (error) {
      // TODO: add message id
      thunkAPI.rejectWithValue('error message id here')
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
      .addCase(selectAllTags.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(selectAllTags.fulfilled, (state, action) => {
        state.status = 'succeeded'
        tagAdapter.upsertMany(state, action.payload)
      })
      .addCase(selectAllTags.rejected, (state, action) => {
        state.status = 'failed'
      })
      .addCase(insertTag.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(insertTag.fulfilled, (state, action: PayloadAction<ITag>) => {
        state.status = 'succeeded'
        tagAdapter.addOne(state, action.payload)
      })
      .addCase(insertTag.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message ?? null
      })
      .addCase(updateTag.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(updateTag.fulfilled, (state, action: PayloadAction<ITag>) => {
        state.status = 'succeeded'
        const payload = action.payload
        const updatedTag: Update<ITag> = {
          id: payload.id!,
          changes: payload,
        }
        tagAdapter.updateOne(state, updatedTag)
      })
      .addCase(updateTag.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message ?? null
      })
      .addCase(deleteTag.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(deleteTag.fulfilled, (state, action: PayloadAction<ITag>) => {
        state.status = 'succeeded'
        tagAdapter.removeOne(state, action.payload.id!)
      })
      .addCase(deleteTag.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message ?? null
      })
  },
})

// export const { add } = tagSlice.actions

export default tagSlice.reducer

export const { selectById, selectAll } = tagAdapter.getSelectors<RootState>(
  (state) => state.tag
)
