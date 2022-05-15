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
  CircularProgress,
  Snackbar,
  Alert,
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
  getErrorMessage,
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
  showErrorSnackbar: boolean
}

type Action =
  | { type: 'update'; payload: any }
  | { type: 'updateStory'; payload: any }
  | { type: 'error'; message: string }

/**
 * reducer of this element
 * @param state the state of the this element
 * @param action action
 * @returns new state
 */
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
  showErrorSnackbar: false,
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
  const parameters: Params<string> = useParams()
  const storyId: number = parseInt(parameters.storyId ?? '0')
  const status = useAppSelector(getTimelineStatus)
  const errorMessage = useAppSelector(getErrorMessage)
  const story = useAppSelector((state) => selectById(state, storyId))
  const tags = useAppSelector(selectAll)

  const [state, dispatch] = useReducer(reducer, initailState)
  const formElement = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (story === undefined) {
      dispatch(updateFormState(initailState))
    } else {
      dispatch(updateFormState({ ...initailState, story: { ...story } }))
    }
  }, [story])

  useEffect(() => {
    switch (status) {
      case 'inserted':
      case 'updated':
      case 'deleted':
        navigate('/')
        break
      case 'failed':
        dispatch(updateFormState({ showErrorSnackbar: true }))
        break
      default:
        break
    }
  }, [status])

  const handleSubmit = () => {
    if (formElement.current === null || !formElement.current.checkValidity())
      return

    if (story === undefined) {
      appDispatch(insertStory(state.story))
    } else {
      appDispatch(updateStory(state.story))
    }
  }

  const handleClose = () => {
    navigate('/')
  }

  const handleDelete = () => {
    appDispatch(deleteStory(story!))
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
    <LoadingButton
      onClick={handleDelete}
      color="error"
      variant="outlined"
      disabled={
        status === 'loading' || status === 'inserting' || status === 'updating'
      }
      loading={status === 'deleting'}
    >
      <FormattedMessage defaultMessage="刪除" id="deleteStory" />
    </LoadingButton>
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

  const storyForm = (
    <form ref={formElement}>
      <Stack spacing={3} sx={{ marginTop: 3, marginBottom: 3 }}>
        <TextField
          variant="outlined"
          label={<FormattedMessage defaultMessage="事件名稱" id="storyTitle" />}
          required
          value={state.story.title}
          error={state.isTitleInvalid}
          onChange={(event) => updateFormStory({ title: event.target.value })}
          onInvalid={() => dispatch(updateFormState({ isTitleInvalid: true }))}
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
          onInvalid={() => dispatch(updateFormState({ isDetailInvalid: true }))}
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
  )

  return (
    <Stack spacing={2}>
      <Typography variant="h5">
        {story === undefined ? (
          <FormattedMessage defaultMessage="新增" id="insetStoryFormTitle" />
        ) : (
          <FormattedMessage defaultMessage="更新" id="updateStoryFormTitle" />
        )}
      </Typography>
      {status === 'loading' && <CircularProgress />}
      {status !== 'loading' && storyForm}
      <ButtonGroup>
        <LoadingButton
          variant="outlined"
          onClick={handleSubmit}
          color="success"
          disabled={status === 'loading' || status === 'deleting'}
          loading={status === 'inserting' || status === 'updating'}
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
      <Snackbar
        autoHideDuration={3000}
        open={state.showErrorSnackbar}
        onClose={() => {
          dispatch(updateFormState({ showErrorSnackbar: false }))
        }}
      >
        <Alert variant="outlined" severity="error">
          {errorMessage}
        </Alert>
      </Snackbar>
    </Stack>
  )
}
