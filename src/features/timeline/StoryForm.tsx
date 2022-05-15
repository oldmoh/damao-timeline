import React, { useEffect, useReducer, useRef } from 'react'
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
import { ColorResult } from 'react-color'

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
import ColorPicker from '../../components/ColorPicker'
import { LocalOffer } from '@mui/icons-material'

interface IFormState {
  isTitleInvalid: boolean
  isTimeInvalid: boolean
  isDetailInvalid: boolean
  isColorInvalid: boolean
  story: IStory
}

type Action =
  | { type: 'update'; payload: any }
  | { type: 'updateStory'; payload: any }
  | { type: 'error'; message: string }

function reducer(state: IFormState, action: Action): IFormState {
  switch (action.type) {
    case 'update':
      return { ...state, ...action.payload }
    case 'updateStory':
      return { ...state, story: { ...state.story, ...action.payload } }
    case 'error':
      return { ...state }
    default:
      return state
  }
}

const initailState: IFormState = {
  isTitleInvalid: false,
  isTimeInvalid: false,
  isDetailInvalid: false,
  isColorInvalid: false,
  story: {
    title: '',
    happenedAt: new Date().getTime(),
    detail: '',
    color: '',
    tagIds: [],
    isArchived: false,
  },
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
  const appDispatch = useAppDispatch()
  const navigate = useNavigate()
  const status = useAppSelector(getTimelineStatus)
  const [state, dispatch] = useReducer(reducer, initailState)

  const parameters: Params<string> = useParams()
  const storyId: number = parseInt(parameters.storyId ?? '0')
  const story = useAppSelector((state) => selectById(state, storyId))
  const tags = useAppSelector(selectAll)

  const formElement = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (story === undefined) {
      dispatch(updateFormState(initailState))
    } else {
      dispatch(updateFormState({ ...initailState, story: { ...story } }))
    }
  }, [story])

  const handleSubmit = () => {
    if (formElement.current === null || !formElement.current.checkValidity())
      return

    let newStory: IStory = {
      ...state.story,
    }
    console.log(newStory)

    if (story === undefined) {
      appDispatch(insertStory(newStory))
    } else {
      newStory.id = story.id
      appDispatch(updateStory(newStory))
    }

    navigate('/')
  }

  const handleClose = () => {
    navigate('/')
  }

  const handleDelete = () => {
    if (story !== undefined) appDispatch(deleteStory(story))
    navigate('/')
  }

  const updateFormStory = (payload: { [index: string]: any }) =>
    dispatch({ type: 'updateStory', payload })

  const tagCheckboxes = tags.map((tag) => (
    <FormControlLabel
      key={`Tag-${tag.id}`}
      control={<Checkbox />}
      checked={state.story.tagIds.includes(tag.id === undefined ? 0 : tag.id)}
      label={
        <Stack direction="row">
          <LocalOffer sx={{ color: tag.color }} />
          {tag.name}
        </Stack>
      }
      value={tag.id}
      onChange={({ target }) => {
        const checkbox = target as HTMLInputElement
        if (checkbox.checked)
          updateFormStory({ tagIds: [...state.story.tagIds, tag.id] })
        else
          updateFormStory({
            tagIds: state.story.tagIds.filter((id: number) => id !== tag.id),
          })
      }}
    />
  ))

  const deleteButton = (
    <Button onClick={handleDelete} color="error" variant="outlined">
      <FormattedMessage defaultMessage="刪除" id="deleteStory" />
    </Button>
  )

  const handleColorSelected = (
    color: ColorResult,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const colorString: string = [color.rgb.r, color.rgb.g, color.rgb.b].reduce(
      (result, value) => `${result}${value.toString(16)}`,
      '#'
    )
    updateFormStory({ color: colorString })
  }

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
        <Stack spacing={3} sx={{ marginTop: 3, marginBottom: 3 }}>
          <TextField
            variant="outlined"
            label={
              <FormattedMessage defaultMessage="事件名稱" id="storyTitle" />
            }
            required
            value={state.story.title}
            error={state.isTitleInvalid}
            onChange={(event) => updateFormStory({ title: event.target.value })}
            onInvalid={() =>
              dispatch(updateFormState({ isTitleInvalid: true }))
            }
          />
          <LocalizationProvider dateAdapter={DateAdapter}>
            <DateTimePicker
              label={
                <FormattedMessage
                  defaultMessage="發生時間"
                  id="storyHappenedAt"
                />
              }
              value={new Date(state.story.happenedAt)}
              inputFormat="yyyy/MM/DD"
              renderInput={(params) => <TextField {...params} />}
              onChange={(storyDatetime) => {
                if (storyDatetime === null) return
                updateFormStory({ happenedAt: storyDatetime.valueOf() })
              }}
            />
          </LocalizationProvider>
          <TextField
            variant="outlined"
            label={<FormattedMessage defaultMessage="詳細" id="storyDetail" />}
            multiline
            value={state.story.detail}
            error={state.isDetailInvalid}
            onChange={({ target }) => updateFormStory({ detail: target.value })}
            onInvalid={() =>
              dispatch(updateFormState({ isDetailInvalid: true }))
            }
          />
          <FormGroup>
            <p>
              <FormattedMessage defaultMessage="標籤" id="storyTags" />
            </p>
            {tagCheckboxes}
          </FormGroup>
          <ColorPicker
            color={state.story.color}
            onChangeComplete={handleColorSelected}
            label="代表顏色"
          />
        </Stack>
      </form>
      <ButtonGroup>
        <LoadingButton
          variant="outlined"
          onClick={handleSubmit}
          loading={status === 'loading'}
          color="success"
        >
          {story === undefined ? (
            <FormattedMessage defaultMessage="新增" id="addStory" />
          ) : (
            <FormattedMessage defaultMessage="更新" id="updateStory" />
          )}
        </LoadingButton>
        {story !== undefined && deleteButton}
        <Button onClick={handleClose} variant="outlined">
          <FormattedMessage defaultMessage="關閉" id="closeStoryForm" />
        </Button>
      </ButtonGroup>
    </Box>
  )
}
