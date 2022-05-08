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

import { insertStory, IStory, updateStory, selectById } from './timelineSlice'
import { useAppDispatch, useAppSelector } from '../../app/hooks'

export const TimelineForm = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const parameters: Params<string> = useParams()
  const storyId: number = parseInt(parameters.storyId ?? '0')
  const story = useAppSelector((state) => selectById(state, storyId))

  // form controls
  const formElement = useRef<HTMLFormElement>(null)

  // form inputs
  const [title, setTitle] = useState<string>('')
  const [happenedAt, setHappenedAt] = useState<number>(new Date().getTime())
  const [detail, setDetail] = useState<string>('')
  const [color, setColor] = useState<string>('')
  const [tagIds, setTagIds] = useState<number[]>([])

  // validation state of inputs
  const [isTitleInvalid, setIsTitleInvalid] = useState(false)
  const [isTimeInvalid, setIsTimeInvalid] = useState(false)
  const [isDetailInvalid, setIsDetailInvalid] = useState(false)
  const [isColorInvalid, setIsColorInvalid] = useState(false)

  useEffect(() => {
    if (story === undefined) {
      setTitle('')
      setHappenedAt(new Date().getTime())
      setDetail('')
      setColor('')
      setTagIds([])
    } else {
      setTitle(story.title)
      setHappenedAt(story.happenedAt)
      setDetail(story.detail)
      setColor(story.color)
      setTagIds(story.tagIds)
    }

    setIsTitleInvalid(false)
    setIsTimeInvalid(false)
    setIsDetailInvalid(false)
    setIsColorInvalid(false)
  }, [story])

  const onSubmit = () => {
    if (formElement.current === null || !formElement.current.checkValidity())
      return

    let newStory: IStory = {
      title: title,
      detail: detail,
      happenedAt: happenedAt,
      tagIds,
      color: color,
      isArchived: false,
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

  const onClosed = () => {
    navigate('/')
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
        <Stack spacing={3} sx={{ marginTop: 3 }}>
          <TextField
            variant="outlined"
            label={
              <FormattedMessage defaultMessage="事件名稱" id="storyTitle" />
            }
            required
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            onInvalid={() => setIsTitleInvalid(true)}
            error={isTitleInvalid}
          />
          <LocalizationProvider dateAdapter={DateAdapter}>
            <DateTimePicker
              label={
                <FormattedMessage
                  defaultMessage="發生時間"
                  id="storyHappenedAt"
                />
              }
              value={new Date(happenedAt)}
              inputFormat="MM/dd/yyyy"
              onChange={(storyDatetime) => {
                if (storyDatetime === null) return
                setHappenedAt(storyDatetime.valueOf())
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
          <TextField
            variant="outlined"
            label={<FormattedMessage defaultMessage="詳細" id="storyDetail" />}
            onChange={(event) => setDetail(event.target.value)}
            multiline
            value={detail}
            onInvalid={() => setIsDetailInvalid(true)}
            error={isDetailInvalid}
          />
          <FormGroup>
            <p>
              <FormattedMessage defaultMessage="標籤" id="storyTags" />
            </p>
            <FormControlLabel control={<Checkbox />} label="" />
          </FormGroup>
          <TextField
            variant="outlined"
            label={<FormattedMessage defaultMessage="顏色" id="storyColor" />}
            onChange={(event) => setColor(event.target.value)}
            onInvalid={() => setIsColorInvalid(true)}
            error={isColorInvalid}
            value={color}
          />
        </Stack>
      </form>
      <ButtonGroup>
        <Button onClick={onSubmit}>
          {story === undefined ? (
            <FormattedMessage defaultMessage="新增" id="addStory" />
          ) : (
            <FormattedMessage defaultMessage="更新" id="updateStory" />
          )}
        </Button>
        <Button onClick={onClosed}>
          <FormattedMessage defaultMessage="關閉" id="closeStoryForm" />
        </Button>
      </ButtonGroup>
    </Box>
  )
}
