import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
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

import { updateStory, deleteStory, getTimelineStatus } from './timelineSlice'
import { useAppDispatch, useAppSelector } from '../../common/hooks'
import { selectAll } from '../tag/tagSlice'
import ColorPicker from '../../components/ColorPicker'
import { LocalOffer } from '@mui/icons-material'
import useLoadStory from './useLoadStory'
import { push } from '../notification/notificationSlice'
import mapValidityToMessages from '../../utilities/mapValidityToMessages'
import { useStoryForm } from './useStoryForm'

type Status = 'ready' | 'submitting' | 'deleting'

export default () => {
  const appDispatch = useAppDispatch()
  const navigate = useNavigate()
  const tags = useAppSelector(selectAll)
  const timelineStatus = useAppSelector(getTimelineStatus)
  const { isLoading, story, hasStoryId } = useLoadStory()
  const { state, update, setStory, generateStory } = useStoryForm()
  const [status, setStatus] = useState<Status>('ready')

  useEffect(() => {
    if (isLoading) return
    if (story === undefined) return
    setStory(story)
  }, [isLoading, story])

  useEffect(() => {
    if (timelineStatus === 'loading') return

    if (status === 'submitting' && timelineStatus === 'succeeded') {
      navigate(`/stories/${story!.id}`)
    }
    if (status === 'submitting' && timelineStatus === 'failed') {
      setStatus('ready')
      appDispatch(push({ message: 'Failed to submit', type: 'error' }))
    }

    if (status === 'deleting' && timelineStatus === 'succeeded') {
      navigate('/')
    }
    if (status === 'deleting' && timelineStatus === 'failed') {
      setStatus('ready')
      appDispatch(push({ message: 'Failed to delete', type: 'error' }))
    }
  }, [timelineStatus, status])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus('submitting')
    await appDispatch(updateStory(generateStory()))
  }

  const handleClose = () => {
    navigate(hasStoryId ? `/stories/${story!.id}` : '/')
  }

  const handleDelete = async () => {
    setStatus('deleting')
    await appDispatch(deleteStory(generateStory()))
  }

  const handleColorSelected = (
    color: ColorResult,
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const colorString: string = [color.rgb.r, color.rgb.g, color.rgb.b].reduce(
      (result, value) => `${result}${value.toString(16)}`,
      '#'
    )
    update({ color: { value: colorString, error: null } })
  }

  const tagCheckboxes = tags.map((tag) => {
    return (
      <FormControlLabel
        key={`Tag-${tag.id}`}
        control={
          <Checkbox
            checked={state.tagIds.value.includes(tag.id!)}
            value={tag.id}
            onChange={({ target }) => {
              const checkbox = target as HTMLInputElement
              let tagIds: number[]
              if (checkbox.checked) tagIds = [...state.tagIds.value, tag.id!]
              else
                tagIds = state.tagIds.value.filter(
                  (id: number) => id !== tag.id
                )
              update({ tagIds: { value: tagIds, error: null } })
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

  return (
    <Stack spacing={2}>
      <Typography variant="h5">
        {hasStoryId ? (
          <FormattedMessage defaultMessage="Edit" id="story.form.title.edit" />
        ) : (
          <FormattedMessage defaultMessage="Add" id="story.form.title.add" />
        )}
      </Typography>
      <form onSubmit={handleSubmit}>
        <Stack spacing={3} sx={{ marginTop: 3, marginBottom: 3 }}>
          <TextField
            variant="outlined"
            label={<FormattedMessage defaultMessage="Title" id="story.title" />}
            required
            value={state.title.value}
            error={state.title.error !== null}
            onChange={({ target }) =>
              update({ title: { value: target.value, error: null } })
            }
            onInvalid={(event) => {
              const target = event.target as HTMLInputElement
              update({
                title: {
                  value: target.value,
                  error: mapValidityToMessages(target.validity),
                },
              })
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
              value={new Date(state.happenedAt.value)}
              inputFormat="yyyy/MM/DD"
              renderInput={(params) => <TextField {...params} />}
              onChange={(storyDatetime) => {
                if (storyDatetime === null) return
                update({
                  happenedAt: { value: storyDatetime.valueOf(), error: null },
                })
              }}
            />
          </LocalizationProvider>
          <TextField
            variant="outlined"
            label={
              <FormattedMessage defaultMessage="Detail" id="story.detail" />
            }
            multiline
            value={state.detail.value}
            error={state.detail.error !== null}
            onChange={({ target }) =>
              update({ detail: { value: target.value, error: null } })
            }
            onInvalid={(event) => {
              const target = event.target as HTMLInputElement
              update({
                detail: {
                  value: target.value,
                  error: mapValidityToMessages(target.validity),
                },
              })
            }}
          />
          <FormGroup>
            <FormattedMessage defaultMessage="Tag" id="story.tag" />
            {tagCheckboxes}
          </FormGroup>
          <ColorPicker
            color={state.color.value}
            onChangeComplete={handleColorSelected}
            label={
              <FormattedMessage id="story.color" defaultMessage={'Color'} />
            }
          />
          <ButtonGroup>
            <LoadingButton
              variant="outlined"
              color="success"
              disabled={isLoading || status === 'deleting'}
              loading={status === 'submitting'}
              type="submit"
            >
              <FormattedMessage defaultMessage="Update" id="button.update" />
            </LoadingButton>
            <LoadingButton
              onClick={handleDelete}
              color="error"
              variant="outlined"
              disabled={isLoading || status === 'submitting'}
              loading={status === 'deleting'}
            >
              <FormattedMessage defaultMessage="Delete" id="button.delete" />
            </LoadingButton>
            <Button
              onClick={handleClose}
              variant="outlined"
              disabled={isLoading}
            >
              <FormattedMessage defaultMessage="Back" id="button.back" />
            </Button>
          </ButtonGroup>
        </Stack>
      </form>
    </Stack>
  )
}
