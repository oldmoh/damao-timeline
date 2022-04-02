import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
  EntityState,
  nanoid,
  PayloadAction,
} from '@reduxjs/toolkit'
import { db } from '../../app/db'
import { RootState } from '../../app/store'

export interface Tag {
  id?: number
  name: string
  description: string
  color: string
}

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

export const insertTag = createAsyncThunk(
  'tag/insert',
  async (tag: Tag, thunkAPI) => {
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

const tagSlice = createSlice({
  name: 'tag',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      insertTag.fulfilled,
      (state, action: PayloadAction<Tag>) => {
        state.status = 'succeeded'
        tagAdapter.addOne(state, action)
      }
    )
  },
})

// export const { add } = tagSlice.actions

export default tagSlice.reducer

export const { selectById, selectAll } = tagAdapter.getSelectors<RootState>(
  (state) => state.tag
)
