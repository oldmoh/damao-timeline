import { useEffect, useReducer, useRef } from 'react'
import { useParams, Params, useNavigate } from 'react-router-dom'
import {
  Button,
  Box,
  Stack,
  TextField,
  Typography,
  ButtonGroup,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material'
import { FormattedMessage } from 'react-intl'

import {
  selectById,
  insertTag,
  ITag,
  updateTag,
  deleteTag,
  getTagStatus,
  getErrorMessage,
} from './tagSlice'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import ColorPicker from '../../components/ColorPicker'
import { ColorResult } from 'react-color'
import { LoadingButton } from '@mui/lab'

interface IFormState {
  isNameInvalid: boolean
  isDescriptionInvalid: boolean
  isColorInvalid: boolean
  tag: ITag
  showErrorSnackbar: boolean
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
  showErrorSnackbar: false,
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
  const parameters: Params<string> = useParams()
  const tagId: number = parseInt(parameters.tagId ?? '0')
  const tag = useAppSelector((state) => selectById(state, tagId))
  const status = useAppSelector(getTagStatus)
  const errorMessage = useAppSelector(getErrorMessage)

  const [formState, dispatch] = useReducer(reducer, initailState)

  const formElement = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (tag === undefined) {
      dispatch(updateFormState(initailState))
    } else {
      dispatch(
        updateFormState({
          ...initailState,
          tag: { ...tag },
        })
      )
    }
  }, [tag])

  useEffect(() => {
    switch (status) {
      case 'inserted':
      case 'updated':
      case 'deleted':
        navigate('/tags')
        break
      case 'failed':
        dispatch(updateFormState({ showErrorSnackbar: true }))
        break
      default:
        break
    }
  }, [status])

  const updateFormTag = (payload: { [index: string]: any }) =>
    dispatch({ type: 'updateTag', payload })

  const handleSubmit = () => {
    if (formElement.current === null || !formElement.current.checkValidity())
      return

    if (tag === undefined) {
      appDispatch(insertTag(formState.tag))
    } else {
      appDispatch(updateTag(formState.tag))
    }
  }

  const handleClose = () => {
    navigate('/tags')
  }

  const handleDelete = () => {
    appDispatch(deleteTag(tag!))
  }

  const deleteButton = (
    <LoadingButton
      onClick={handleDelete}
      variant="outlined"
      color="error"
      disabled={
        status === 'loading' || status === 'inserting' || status === 'updating'
      }
      loading={status === 'deleting'}
    >
      <FormattedMessage defaultMessage="刪除" id="deleteTag" />
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
          label={<FormattedMessage defaultMessage="標籤名稱" id="tagName" />}
          required
          value={formState.tag.name}
          error={formState.isNameInvalid}
          onChange={({ target }) => updateFormTag({ name: target.value })}
          onInvalid={() => dispatch(updateFormState({ isNameInvalid: true }))}
        />
        <TextField
          variant="outlined"
          label={
            <FormattedMessage defaultMessage="關於標籤" id="tagDescription" />
          }
          multiline
          value={formState.tag.description}
          error={formState.isDescriptionInvalid}
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
          label="標籤顏色"
        />
      </Stack>
    </form>
  )

  return (
    <Stack spacing={2}>
      {status === 'loading' && <CircularProgress />}
      {status !== 'loading' && tagForm}
      <ButtonGroup>
        <LoadingButton
          onClick={handleSubmit}
          disabled={status === 'loading' || status === 'deleting'}
          loading={status === 'inserting' || status === 'updating'}
          variant="outlined"
        >
          {tag === undefined ? (
            <FormattedMessage defaultMessage="新增" id="addTag" />
          ) : (
            <FormattedMessage defaultMessage="更新" id="updateTag" />
          )}
        </LoadingButton>
        {tag !== undefined && deleteButton}
        <Button onClick={handleClose}>
          <FormattedMessage defaultMessage="關閉" id="closeTagForm" />
        </Button>
      </ButtonGroup>
      <Snackbar
        autoHideDuration={3000}
        open={formState.showErrorSnackbar}
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
