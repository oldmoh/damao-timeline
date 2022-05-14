import { useEffect, useReducer, useRef } from 'react'
import { useParams, Params, useNavigate } from 'react-router-dom'
import {
  Button,
  Checkbox,
  Box,
  FormControlLabel,
  FormGroup,
  Stack,
  TextField,
  Typography,
  ButtonGroup,
} from '@mui/material'
import { DateTimePicker, LoadingButton, LocalizationProvider } from '@mui/lab'
import DateAdapter from '@mui/lab/AdapterMoment'
import { FormattedMessage } from 'react-intl'

import {
  insertStory,
  IStory,
  updateStory,
  selectById,
  deleteStory,
  getTimelineStatus,
} from './timelineSlice'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { selectAll } from '../tag/tagSlice'

interface IFormState extends IStory {
  isTitleInvalid: boolean
  isTimeInvalid: boolean
  isDetailInvalid: boolean
  isColorInvalid: boolean
}

type Action =
  | { type: 'update'; payload: any }
  | { type: 'error'; message: string }

function reducer(state: IFormState, action: Action): IFormState {
  switch (action.type) {
    case 'update':
      return { ...state, ...action.payload }
    case 'error':
      return { ...state }
    default:
      return state
  }
}

const initailState: IFormState = {
  title: '',
  happenedAt: new Date().getTime(),
  detail: '',
  color: '',
  tagIds: [],
  isTitleInvalid: false,
  isTimeInvalid: false,
  isDetailInvalid: false,
  isColorInvalid: false,
  isArchived: false,
}

/**
 * create update action with payload
 * @param payload payload
 * @returns update action
 */
const updateFormState = (payload: { [index: string]: any }): Action => {
  return { type: 'update', payload }
}

export default () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const status = useAppSelector(getTimelineStatus)
  const [state, formDispatch] = useReducer(reducer, initailState)

  const parameters: Params<string> = useParams()
  const storyId: number = parseInt(parameters.storyId ?? '0')
  const story = useAppSelector((state) => selectById(state, storyId))
  const tags = useAppSelector(selectAll)

  // form controls
  const formElement = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (story === undefined) {
      formDispatch(updateFormState(initailState))
    } else {
      formDispatch(updateFormState({ ...initailState, ...story }))
    }
  }, [story])

  const handleSubmit = () => {
    if (formElement.current === null || !formElement.current.checkValidity())
      return

    let newStory: IStory = {
      title: state.title,
      detail: state.detail,
      happenedAt: state.happenedAt,
      tagIds: state.tagIds,
      color: state.color,
      isArchived: state.isArchived,
    }
    console.log(newStory)

    if (story === undefined) {
      dispatch(insertStory(newStory))
    } else {
      newStory.id = story.id
      dispatch(updateStory(newStory))
    }

    navigate('/')
  }

  const handleClose = () => {
    navigate('/')
  }

  const handleDelete = () => {
    if (story !== undefined) dispatch(deleteStory(story))
    navigate('/')
  }

  const tagCheckboxes = tags.map((tag) => (
    <FormControlLabel
      key={`Tag-${tag.id}`}
      control={<Checkbox />}
      checked={state.tagIds.includes(tag.id === undefined ? 0 : tag.id)}
      label={tag.name}
      value={tag.id}
      onChange={(event) => {
        const checkbox = event.target as HTMLInputElement
        if (checkbox.checked)
          formDispatch(updateFormState({ tagIds: [...state.tagIds, tag.id] }))
        else
          formDispatch(
            updateFormState({
              tagIds: state.tagIds.filter((id: number) => id !== tag.id),
            })
          )
      }}
    />
  ))

  return (
    <Box>
      <Typography>
        {story === undefined ? (
          <FormattedMessage defaultMessage="新增" id="insetStoryFormTitle" />
        ) : (
          <FormattedMessage defaultMessage="更新" id="updateStoryFormTitle" />
        )}
      </Typography>
      <form ref={formElement}>
        <Stack spacing={3} sx={{ marginTop: 3 }}>
          <TextField
            variant="outlined"
            label={
              <FormattedMessage defaultMessage="事件名稱" id="storyTitle" />
            }
            required
            value={state.title}
            onChange={(event) =>
              formDispatch(updateFormState({ title: event.target.value }))
            }
            onInvalid={() =>
              formDispatch(updateFormState({ isTitleInvalid: true }))
            }
            error={state.isTitleInvalid}
          />
          <LocalizationProvider dateAdapter={DateAdapter}>
            <DateTimePicker
              label={
                <FormattedMessage
                  defaultMessage="發生時間"
                  id="storyHappenedAt"
                />
              }
              value={new Date(state.happenedAt)}
              inputFormat="MM/dd/yyyy"
              onChange={(storyDatetime) => {
                if (storyDatetime === null) return
                formDispatch(
                  updateFormState({ happenedAt: storyDatetime.valueOf() })
                )
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
          <TextField
            variant="outlined"
            label={<FormattedMessage defaultMessage="詳細" id="storyDetail" />}
            onChange={(event) =>
              formDispatch(updateFormState({ detail: event.target.value }))
            }
            multiline
            value={state.detail}
            onInvalid={() =>
              formDispatch(updateFormState({ isDetailInvalid: true }))
            }
            error={state.isDetailInvalid}
          />
          <FormGroup>
            <p>
              <FormattedMessage defaultMessage="標籤" id="storyTags" />
            </p>
            {tagCheckboxes}
          </FormGroup>
          <TextField
            variant="outlined"
            label={<FormattedMessage defaultMessage="顏色" id="storyColor" />}
            onChange={(event) =>
              formDispatch(updateFormState({ color: event.target.value }))
            }
            onInvalid={() =>
              formDispatch(updateFormState({ isColorInvalid: true }))
            }
            error={state.isColorInvalid}
            value={state.color}
          />
        </Stack>
      </form>
      <ButtonGroup>
        <LoadingButton onClick={handleSubmit} loading={status === 'loading'}>
          {story === undefined ? (
            <FormattedMessage defaultMessage="新增" id="addStory" />
          ) : (
            <FormattedMessage defaultMessage="更新" id="updateStory" />
          )}
        </LoadingButton>
        {story !== undefined && (
          <Button onClick={handleDelete} color="error" variant="contained">
            <FormattedMessage defaultMessage="刪除" id="deleteStory" />
          </Button>
        )}
        <Button onClick={handleClose}>
          <FormattedMessage defaultMessage="關閉" id="closeStoryForm" />
        </Button>
      </ButtonGroup>
    </Box>
  )
}
