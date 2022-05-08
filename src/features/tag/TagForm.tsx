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

interface IFormState extends ITag {
  isTitleInvalid: boolean
  isTimeInvalid: boolean
  isDetailInvalid: boolean
  isColorInvalid: boolean
}

type Action =
  | { type: 'update'; payload: any }
  | { type: 'error'; message: string }

function reducer(state: IFormState, action: Action) {
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
  name: '',
  description: '',
  color: '',
  isTitleInvalid: false,
  isTimeInvalid: false,
  isDetailInvalid: false,
  isColorInvalid: false,
}

/**
 * create update action with payload
 * @param payload payload
 * @returns update action
 */
const updateFormState = (payload: { [index: string]: any }): Action => {
  return { type: 'update', payload }
}

export const TagForm = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [state, formDispatch] = useReducer(reducer, initailState)

  const parameters: Params<string> = useParams()
  const tagId: number = parseInt(parameters.tagId ?? '0')
  const tag = useAppSelector((state) => selectById(state, tagId))

  // form controls
  const formElement = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (tag === undefined) {
      formDispatch(updateFormState(initailState))
    } else {
      formDispatch(updateFormState({ ...initailState, ...tag }))
    }
  }, [tag])

  const handleSubmit = () => {
    if (formElement.current === null || !formElement.current.checkValidity())
      return

    let newTag: ITag = {
      name: state.name,
      description: state.description,
      color: state.color,
    }
    console.log(newTag)

    if (tag === undefined) {
      dispatch(insertTag(newTag))
    } else {
      newTag.id = tag.id
      dispatch(updateTag(newTag))
    }

    navigate('/tags')
  }

  const handleClose = () => {
    navigate('/tags')
  }

  const handleDelete = () => {
    if (tag !== undefined) dispatch(deleteTag(tag))
    navigate('/tags')
  }

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
            value={state.name}
            onChange={(event) =>
              formDispatch(updateFormState({ name: event.target.value }))
            }
            onInvalid={() =>
              formDispatch(updateFormState({ isNameInvalid: true }))
            }
            error={state.isNameInvalid}
          />
          <TextField
            variant="outlined"
            label={
              <FormattedMessage defaultMessage="關於標籤" id="tagDescription" />
            }
            onChange={(event) =>
              formDispatch(updateFormState({ description: event.target.value }))
            }
            multiline
            value={state.description}
            onInvalid={() =>
              formDispatch(updateFormState({ isDescriptionInvalid: true }))
            }
            error={state.isDescriptionInvalid}
          />
          <TextField
            variant="outlined"
            label={<FormattedMessage defaultMessage="代表顏色" id="tagColor" />}
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
        <Button onClick={handleSubmit}>
          {tag === undefined ? (
            <FormattedMessage defaultMessage="新增" id="addTag" />
          ) : (
            <FormattedMessage defaultMessage="更新" id="updateTag" />
          )}
        </Button>
        {tag !== undefined && (
          <Button onClick={handleDelete} color="error" variant="contained">
            <FormattedMessage defaultMessage="刪除" id="deleteTag" />
          </Button>
        )}
        <Button onClick={handleClose}>
          <FormattedMessage defaultMessage="關閉" id="closeTagForm" />
        </Button>
      </ButtonGroup>
    </Box>
  )
}
