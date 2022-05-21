import React, { useEffect, useReducer, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Stack,
  TextField,
  Typography,
  ButtonGroup,
  CircularProgress,
} from '@mui/material'
import { DateTimePicker, LoadingButton, LocalizationProvider } from '@mui/lab'
import DateAdapter from '@mui/lab/AdapterMoment'
import { FormattedMessage } from 'react-intl'
import { ColorResult } from 'react-color'

import { IStory } from '../../app/Timeline'
import {
  insertStory,
  updateStory,
  deleteStory,
  fetchStoryById,
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
  status: 'loading' | 'ready' | 'submitting' | 'deleting'
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
  status: 'loading',
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
  const tags = useAppSelector(selectAll)
  const parameters = useParams()

  const hasStoryId = parameters.storyId ? true : false

  const [state, dispatch] = useReducer(reducer, initailState)
  const formElement = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state.status !== 'loading') return
    const fetchStory = async () => {
      try {
        const storyId = parseInt(parameters.storyId ?? '0')
        const story = await appDispatch(fetchStoryById(storyId)).unwrap()
        if (story) updateFormStory(story)
      } catch (error) {
        console.log(error)
      }
      dispatch(updateFormState({ status: 'ready' }))
    }
    fetchStory()
  }, [state.status, parameters])

  const handleSubmit = async () => {
    if (formElement.current === null || !formElement.current.checkValidity())
      return

    try {
      dispatch(updateFormState({ status: 'submitting' }))
      if (parameters.storyId) {
        await appDispatch(updateStory(state.story))
      } else {
        await appDispatch(insertStory(state.story))
      }
      navigate('/')
    } catch (error) {
      dispatch(updateFormState({ status: 'ready' }))
      console.log(error)
    }
  }

  const handleClose = () => {
    navigate('/')
  }

  const handleDelete = async () => {
    try {
      dispatch(updateFormState({ status: 'deleting' }))
      appDispatch(deleteStory(state.story!))
      navigate('/')
    } catch (error) {
      dispatch(updateFormState({ status: 'ready' }))
    }
  }

  const updateFormStory = (payload: { [index: string]: any }) =>
    dispatch({ type: 'updateStory', payload })

  const tagCheckboxes = tags.map((tag) => {
    return (
      <FormControlLabel
        key={`Tag-${tag.id}`}
        control={
          <Checkbox
            checked={state.story.tagIds.includes(tag.id!)}
            value={tag.id}
            onChange={({ target }) => {
              const checkbox = target as HTMLInputElement
              if (checkbox.checked)
                updateFormStory({ tagIds: [...state.story.tagIds, tag.id] })
              else
                updateFormStory({
                  tagIds: state.story.tagIds.filter(
                    (id: number) => id !== tag.id
                  ),
                })
            }}
          />
        }
        label={
          <Stack direction="row">
            <LocalOffer sx={{ color: tag.color }} />
            {tag.name}
          </Stack>
        }
      />
    )
  })

  const deleteButton = (
    <LoadingButton
      onClick={handleDelete}
      color="error"
      variant="outlined"
      disabled={state.status === 'submitting'}
      loading={state.status === 'submitting'}
    >
      <FormattedMessage defaultMessage="Delete" id="button.delete" />
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
          label={<FormattedMessage defaultMessage="Title" id="story.title" />}
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
                defaultMessage="Happened at"
                id="story.happenedAt"
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
          label={<FormattedMessage defaultMessage="Detail" id="story.detail" />}
          multiline
          value={state.story.detail}
          error={state.isDetailInvalid}
          onChange={({ target }) => updateFormStory({ detail: target.value })}
          onInvalid={() => dispatch(updateFormState({ isDetailInvalid: true }))}
        />
        <FormGroup>
          <p>
            <FormattedMessage defaultMessage="Tag" id="story.tag" />
          </p>
          {tagCheckboxes}
        </FormGroup>
        <ColorPicker
          color={state.story.color}
          onChangeComplete={handleColorSelected}
          label={<FormattedMessage id="story.color" defaultMessage={'Color'} />}
        />
      </Stack>
    </form>
  )

  return (
    <Stack spacing={2}>
      <Typography variant="h5">
        {hasStoryId ? (
          <FormattedMessage defaultMessage="Add" id="story.form.title.add" />
        ) : (
          <FormattedMessage defaultMessage="Edit" id="story.form.title.edit" />
        )}
      </Typography>
      {state.status === 'loading' ? <CircularProgress /> : storyForm}
      <ButtonGroup>
        <LoadingButton
          variant="outlined"
          onClick={handleSubmit}
          color="success"
          disabled={state.status === 'deleting'}
          loading={state.status === 'deleting'}
        >
          {hasStoryId ? (
            <FormattedMessage defaultMessage="Update" id="button.update" />
          ) : (
            <FormattedMessage defaultMessage="Add" id="button.add" />
          )}
        </LoadingButton>
        {hasStoryId && deleteButton}
        <Button onClick={handleClose} variant="outlined">
          <FormattedMessage defaultMessage="Back" id="button.back" />
        </Button>
      </ButtonGroup>
    </Stack>
  )
}
