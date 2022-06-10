import { useEffect, useReducer, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Button,
  Stack,
  TextField,
  ButtonGroup,
  CircularProgress,
} from '@mui/material'
import { FormattedMessage } from 'react-intl'
import { LoadingButton } from '@mui/lab'
import { ColorResult } from 'react-color'

import { Tag } from '../../app/types'
import { insertTag, updateTag, deleteTag, fetchTagById } from './tagSlice'
import { useAppDispatch } from '../../common/hooks'
import ColorPicker from '../../components/ColorPicker'
import { push } from '../notification/notificationSlice'

interface IFormState {
  isNameInvalid: boolean
  isDescriptionInvalid: boolean
  isColorInvalid: boolean
  tag: Tag
  status: 'loading' | 'ready' | 'submitting' | 'deleting'
}

type Action =
  | { type: 'updateState'; payload: any }
  | { type: 'updateTag'; payload: any }
  | { type: 'error'; message: string }

function reducer(state: IFormState, action: Action): IFormState {
  switch (action.type) {
    case 'updateState':
      return { ...state, ...action.payload }
    case 'updateTag':
      return { ...state, tag: { ...state.tag, ...action.payload } }
    case 'error':
      return { ...state }
    default:
      return state
  }
}

const initailState: IFormState = {
  isNameInvalid: false,
  isDescriptionInvalid: false,
  isColorInvalid: false,
  tag: { name: '', description: '', color: '' },
  status: 'loading',
}

/**
 * create update action with payload
 * @param payload payload
 * @returns update action
 */
const updateFormState = (payload: { [index: string]: any }): Action => {
  return { type: 'updateState', payload }
}

export default () => {
  const appDispatch = useAppDispatch()
  const navigate = useNavigate()
  const parameters = useParams()

  const hasTagId = parameters.tagId ? true : false
  const [formState, dispatch] = useReducer(reducer, initailState)
  const formElement = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (formState.status !== 'loading') return
    const fetchTag = async () => {
      try {
        const tagId: number = parseInt(parameters.tagId ?? '0')
        const tag = await appDispatch(fetchTagById(tagId)).unwrap()
        if (tag) updateFormTag(tag)
      } catch (error) {}
      dispatch(updateFormState({ status: 'ready' }))
    }
    fetchTag()
  }, [formState.status, parameters])

  const updateFormTag = (payload: { [index: string]: any }) =>
    dispatch({ type: 'updateTag', payload })

  const handleSubmit = async () => {
    if (formElement.current === null || !formElement.current.checkValidity())
      return

    try {
      dispatch(updateFormState({ status: 'submitting' }))
      if (hasTagId) {
        await appDispatch(updateTag(formState.tag)).unwrap()
      } else {
        await appDispatch(insertTag(formState.tag)).unwrap()
      }
      navigate('/tags')
    } catch (error) {
      dispatch(updateFormState({ status: 'ready' }))
      appDispatch(push({ message: 'Failed to submit', type: 'error' }))
    }
  }

  const handleClose = () => {
    navigate('/tags')
  }

  const handleDelete = async () => {
    try {
      dispatch(updateFormState({ status: 'deleting' }))
      await appDispatch(deleteTag(formState.tag)).unwrap()
      navigate('/tags')
    } catch (error) {
      dispatch(updateFormState({ status: 'ready' }))
      appDispatch(push({ message: 'Failed to delete', type: 'error' }))
    }
  }

  const deleteButton = (
    <LoadingButton
      onClick={handleDelete}
      variant="outlined"
      color="error"
      disabled={formState.status === 'submitting'}
      loading={formState.status === 'deleting'}
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
    updateFormTag({ color: colorString })
  }

  const tagForm = (
    <form ref={formElement}>
      <Stack spacing={3} sx={{ marginTop: 3, marginBottom: 3 }}>
        <TextField
          variant="outlined"
          label={<FormattedMessage defaultMessage="Name" id="tag.name" />}
          required
          error={formState.isNameInvalid}
          value={formState.tag.name}
          onChange={({ target }) => updateFormTag({ name: target.value })}
          onInvalid={() => dispatch(updateFormState({ isNameInvalid: true }))}
        />
        <TextField
          variant="outlined"
          label={
            <FormattedMessage
              defaultMessage="Description"
              id="tag.description"
            />
          }
          multiline
          error={formState.isDescriptionInvalid}
          value={formState.tag.description}
          onChange={({ target }) =>
            updateFormTag({ description: target.value })
          }
          onInvalid={() =>
            dispatch(updateFormState({ isDescriptionInvalid: true }))
          }
        />
        <ColorPicker
          color={formState.tag.color}
          onChangeComplete={handleColorSelected}
          label={
            <FormattedMessage defaultMessage={'Tag Color'} id="storyColor" />
          }
        />
      </Stack>
    </form>
  )

  return (
    <Stack spacing={2}>
      {formState.status === 'loading' ? <CircularProgress /> : tagForm}
      <ButtonGroup>
        <LoadingButton
          onClick={handleSubmit}
          disabled={formState.status === 'deleting'}
          loading={formState.status === 'submitting'}
          variant="outlined"
        >
          {hasTagId ? (
            <FormattedMessage defaultMessage="Update" id="button.update" />
          ) : (
            <FormattedMessage defaultMessage="Add" id="button.add" />
          )}
        </LoadingButton>
        {hasTagId && deleteButton}
        <Button onClick={handleClose}>
          <FormattedMessage defaultMessage="Back" id="button.back" />
        </Button>
      </ButtonGroup>
    </Stack>
  )
}
