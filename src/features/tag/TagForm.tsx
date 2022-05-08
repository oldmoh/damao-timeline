import { useEffect, useRef, useState } from 'react'
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
import { DateTimePicker, LocalizationProvider } from '@mui/lab'
import DateAdapter from '@mui/lab/AdapterMoment'
import { FormattedMessage } from 'react-intl'

import { selectById, insertTag, ITag, updateTag, deleteTag } from './tagSlice'
import { useAppDispatch, useAppSelector } from '../../app/hooks'

export const TagForm = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const parameters: Params<string> = useParams()
  const tagId: number = parseInt(parameters.tagId ?? '0')
  const tag = useAppSelector((state) => selectById(state, tagId))

  // form controls
  const formElement = useRef<HTMLFormElement>(null)

  // form inputs
  const [name, setName] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [color, setColor] = useState<string>('')

  // validation state of inputs
  const [isNameInvalid, setIsNameInvalid] = useState(false)
  const [isDescriptionInvalid, setIsDescriptionInvalid] = useState(false)
  const [isColorInvalid, setIsColorInvalid] = useState(false)

  useEffect(() => {
    if (tag === undefined) {
      setName('')
      setDescription('')
      setColor('')
    } else {
      setName(tag.name)
      setDescription(tag.description)
      setColor(tag.color)
    }

    setIsNameInvalid(false)
    setIsDescriptionInvalid(false)
    setIsColorInvalid(false)
  }, [tag])

  const handleSubmit = () => {
    if (formElement.current === null || !formElement.current.checkValidity())
      return

    let newTag: ITag = {
      name: name,
      description: description,
      color: color,
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
            value={name}
            onChange={(event) => setName(event.target.value)}
            onInvalid={() => setIsNameInvalid(true)}
            error={isNameInvalid}
          />
          <TextField
            variant="outlined"
            label={
              <FormattedMessage defaultMessage="關於標籤" id="tagDescription" />
            }
            onChange={(event) => setDescription(event.target.value)}
            multiline
            value={description}
            onInvalid={() => setIsDescriptionInvalid(true)}
            error={isDescriptionInvalid}
          />
          <TextField
            variant="outlined"
            label={<FormattedMessage defaultMessage="代表顏色" id="tagColor" />}
            onChange={(event) => setColor(event.target.value)}
            onInvalid={() => setIsColorInvalid(true)}
            error={isColorInvalid}
            value={color}
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
