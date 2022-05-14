import { useEffect, useReducer, useRef } from 'react'
import { useParams, Params, useNavigate } from 'react-router-dom'
import {
  Button,
  Box,
  Stack,
  TextField,
  Typography,
  ButtonGroup,
} from '@mui/material'
import { FormattedMessage } from 'react-intl'

import { selectById, insertTag, ITag, updateTag, deleteTag } from './tagSlice'
import { useAppDispatch, useAppSelector } from '../../app/hooks'

interface IFormState {
  isNameInvalid: boolean
  isDescriptionInvalid: boolean
  isColorInvalid: boolean
  tag: ITag
}

type Action =
  | { type: 'update'; payload: any }
  | { type: 'updateTag'; payload: any }
  | { type: 'error'; message: string }

function reducer(state: IFormState, action: Action): IFormState {
  switch (action.type) {
    case 'update':
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
  const [state, dispatch] = useReducer(reducer, initailState)

  const parameters: Params<string> = useParams()
  const tagId: number = parseInt(parameters.tagId ?? '0')
  const tag = useAppSelector((state) => selectById(state, tagId))

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

  const updateFormTag = (payload: { [index: string]: any }) =>
    dispatch({ type: 'updateTag', payload })

  const handleSubmit = () => {
    if (formElement.current === null || !formElement.current.checkValidity())
      return

    let newTag: ITag = {
      ...state.tag,
    }
    console.log(newTag)

    if (tag === undefined) {
      appDispatch(insertTag(newTag))
    } else {
      newTag.id = tag.id
      appDispatch(updateTag(newTag))
    }

    navigate('/tags')
  }

  const handleClose = () => {
    navigate('/tags')
  }

  const handleDelete = () => {
    if (tag !== undefined) appDispatch(deleteTag(tag))
    navigate('/tags')
  }

  const deleteButton = (
    <Button onClick={handleDelete} color="error" variant="contained">
      <FormattedMessage defaultMessage="刪除" id="deleteTag" />
    </Button>
  )

  return (
    <Box>
      <Typography>
        {tag === undefined ? (
          <FormattedMessage defaultMessage="新增" id="insetStoryFormTitle" />
        ) : (
          <FormattedMessage defaultMessage="更新" id="updateStoryFormTitle" />
        )}
      </Typography>
      <form ref={formElement}>
        <Stack spacing={3} sx={{ marginTop: 3 }}>
          <TextField
            variant="outlined"
            label={<FormattedMessage defaultMessage="標籤名稱" id="tagName" />}
            required
            value={state.tag.name}
            error={state.isNameInvalid}
            onChange={({ target }) => updateFormTag({ name: target.value })}
            onInvalid={() => dispatch(updateFormState({ isNameInvalid: true }))}
          />
          <TextField
            variant="outlined"
            label={
              <FormattedMessage defaultMessage="關於標籤" id="tagDescription" />
            }
            multiline
            value={state.tag.description}
            error={state.isDescriptionInvalid}
            onChange={({ target }) =>
              updateFormTag({ description: target.value })
            }
            onInvalid={() =>
              dispatch(updateFormState({ isDescriptionInvalid: true }))
            }
          />
          <TextField
            variant="outlined"
            label={<FormattedMessage defaultMessage="代表顏色" id="tagColor" />}
            error={state.isColorInvalid}
            value={state.tag.color}
            onChange={({ target }) => updateFormTag({ color: target.value })}
            onInvalid={() =>
              dispatch(updateFormState({ isColorInvalid: true }))
            }
          />
        </Stack>
      </form>
      <ButtonGroup>
        <Button onClick={handleSubmit}>
          {tag === undefined ? (
            <FormattedMessage defaultMessage="新增" id="addTag" />
          ) : (
            <FormattedMessage defaultMessage="更新" id="updateTag" />
          )}
        </Button>
        {tag !== undefined && deleteButton}
        <Button onClick={handleClose}>
          <FormattedMessage defaultMessage="關閉" id="closeTagForm" />
        </Button>
      </ButtonGroup>
    </Box>
  )
}
