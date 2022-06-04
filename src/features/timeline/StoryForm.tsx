import React, { useEffect, useReducer, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
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

import { IStory, IValidityState } from '../../app/types'
import { insertStory, updateStory, deleteStory } from './timelineSlice'
import { useAppDispatch, useAppSelector } from '../../common/hooks'
import { selectAll } from '../tag/tagSlice'
import ColorPicker from '../../components/ColorPicker'
import { LocalOffer } from '@mui/icons-material'
import useLoadStory from './useLoadStory'

interface IFormState {
  titleValidity: IValidityState
  timeValidity: IValidityState
  detailValidity: IValidityState
  colorValidity: IValidityState
  story: IStory
  status: 'ready' | 'submitting' | 'deleting'
}

type Action =
  | { type: 'update'; payload: any }
  | { type: 'updateStory'; payload: any }
  | { type: 'validate'; message: string }

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
    case 'validate':
      return { ...state }
    default:
      return state
  }
}

const initailState: IFormState = {
  titleValidity: { valid: true, error: null },
  timeValidity: { valid: true, error: null },
  detailValidity: { valid: true, error: null },
  colorValidity: { valid: true, error: null },
  story: {
    title: '',
    happenedAt: new Date().getTime(),
    detail: '',
    color: '',
    tagIds: [],
    isArchived: false,
  },
  status: 'ready',
}

/**
 * create update action with payload
 * @param payload payload
 * @returns update action
 */
const updateFormState = (payload: { [index: string]: any }): Action => {
  return { type: 'update', payload }
}

/**
 * create update action with payload
 * @param payload story
 * @returns update action
 */
const updateFormStory = (payload: { [index: string]: any }): Action => {
  return { type: 'updateStory', payload }
}

/**
 *
 * @param validity validity state of input elements
 * @returns validity state of form elements
 */
function validate(validity: ValidityState): IValidityState {
  if (validity.valid) return { valid: true, error: null }

  if (validity.valueMissing) return { valid: false, error: 'value is missing' }

  return { valid: false, error: null }
}

export default () => {
  const appDispatch = useAppDispatch()
  const navigate = useNavigate()
  const tags = useAppSelector(selectAll)
  const { isLoading, story, hasStoryId } = useLoadStory()

  const [state, dispatch] = useReducer(reducer, initailState)
  const formElement = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (isLoading) return
    dispatch({ type: 'updateStory', payload: story })
  }, [isLoading, story])

  const handleSubmit = async () => {
    if (formElement.current === null || !formElement.current.checkValidity())
      return
    try {
      dispatch(updateFormState({ status: 'submitting' }))
      if (hasStoryId) {
        await appDispatch(updateStory(state.story))
        navigate(`/stories/${state.story.id}`)
      } else {
        await appDispatch(insertStory(state.story))
        navigate('/')
      }
    } catch (error) {
      dispatch(updateFormState({ status: 'ready' }))
      console.log(error)
    }
  }

  const handleClose = () => {
    navigate(hasStoryId ? `/stories/${state.story.id}` : '/')
  }

  const handleDelete = async () => {
    try {
      dispatch(updateFormState({ status: 'deleting' }))
      await appDispatch(deleteStory(state.story!))
      navigate('/')
    } catch (error) {
      dispatch(updateFormState({ status: 'ready' }))
    }
  }

  const handleColorSelected = (
    color: ColorResult,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const colorString: string = [color.rgb.r, color.rgb.g, color.rgb.b].reduce(
      (result, value) => `${result}${value.toString(16)}`,
      '#'
    )
    dispatch(updateFormStory({ color: colorString }))
  }

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
              let tagIds: number[]
              if (checkbox.checked) tagIds = [...state.story.tagIds, tag.id!]
              else
                tagIds = state.story.tagIds.filter(
                  (id: number) => id !== tag.id
                )
              dispatch(updateFormStory({ tagIds }))
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
      disabled={isLoading || state.status === 'submitting'}
      loading={state.status === 'submitting'}
    >
      <FormattedMessage defaultMessage="Delete" id="button.delete" />
    </LoadingButton>
  )

  const storyForm = (
    <form ref={formElement}>
      <Stack spacing={3} sx={{ marginTop: 3, marginBottom: 3 }}>
        <TextField
          variant="outlined"
          label={<FormattedMessage defaultMessage="Title" id="story.title" />}
          required
          value={state.story.title}
          error={!state.titleValidity.valid}
          onChange={({ target }) =>
            dispatch(updateFormStory({ title: target.value }))
          }
          onInvalid={(event) => {
            const target = event.target as HTMLInputElement
            dispatch(
              updateFormState({ titleValidity: validate(target.validity) })
            )
          }}
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
              dispatch(updateFormStory({ happenedAt: storyDatetime.valueOf() }))
            }}
          />
        </LocalizationProvider>
        <TextField
          variant="outlined"
          label={<FormattedMessage defaultMessage="Detail" id="story.detail" />}
          multiline
          value={state.story.detail}
          error={!state.detailValidity.valid}
          onChange={({ target }) =>
            dispatch(updateFormStory({ detail: target.value }))
          }
          onInvalid={(event) => {
            const target = event.target as HTMLInputElement
            dispatch(
              updateFormState({ titleValidity: validate(target.validity) })
            )
          }}
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
          <FormattedMessage defaultMessage="Edit" id="story.form.title.edit" />
        ) : (
          <FormattedMessage defaultMessage="Add" id="story.form.title.add" />
        )}
      </Typography>
      {isLoading ? <CircularProgress /> : storyForm}
      <ButtonGroup>
        <LoadingButton
          variant="outlined"
          onClick={handleSubmit}
          color="success"
          disabled={isLoading || state.status === 'deleting'}
          loading={state.status === 'deleting'}
        >
          {hasStoryId ? (
            <FormattedMessage defaultMessage="Update" id="button.update" />
          ) : (
            <FormattedMessage defaultMessage="Add" id="button.add" />
          )}
        </LoadingButton>
        {hasStoryId && deleteButton}
        <Button onClick={handleClose} variant="outlined" disabled={isLoading}>
          <FormattedMessage defaultMessage="Back" id="button.back" />
        </Button>
      </ButtonGroup>
    </Stack>
  )
}
