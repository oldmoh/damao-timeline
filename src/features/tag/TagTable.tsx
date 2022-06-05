import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CircularProgress,
  Fab,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
} from '@mui/material'
import { Helmet } from 'react-helmet'
import AddIcon from '@mui/icons-material/Add'

import { useAppDispatch, useAppSelector } from '../../common/hooks'
import { getTagStatus, selectAll, selectAllTags } from './tagSlice'
import { LocalOffer } from '@mui/icons-material'
import { useIntl } from 'react-intl'

export default () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const tags = useAppSelector(selectAll)
  const status = useAppSelector(getTagStatus)
  const intl = useIntl()

  const listItems = tags.map((tag) => (
    <ListItem key={`TimelineTag-${tag.id}`}>
      <ListItemButton onClick={() => navigate(`/tags/${tag.id}`)}>
        <ListItemIcon>
          <LocalOffer sx={{ color: tag.color }} />
        </ListItemIcon>
        <ListItemText
          primary={tag.name}
          secondary={tag.description}
        ></ListItemText>
      </ListItemButton>
    </ListItem>
  ))

  useEffect(() => {
    dispatch(selectAllTags())
  }, [])

  return (
    <>
      <Helmet>
        <title>
          {intl.formatMessage({ id: 'tags.title', defaultMessage: 'Tag' })}- Big
          Cat
        </title>
      </Helmet>
      <Stack spacing={4}>
        {status === 'loading' && <CircularProgress />}
        {status === 'succeeded' && <List>{listItems}</List>}
      </Stack>
      <Fab
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        color="primary"
        onClick={() => navigate('/tags/create')}
      >
        <AddIcon />
      </Fab>
    </>
  )
}
