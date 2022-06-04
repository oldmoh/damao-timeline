import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Button,
  CircularProgress,
  Fab,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
} from '@mui/material'
import { Box } from '@mui/system'
import AddIcon from '@mui/icons-material/Add'

import { useAppDispatch, useAppSelector } from '../../common/hooks'
import { getTagStatus, selectAll, selectAllTags } from './tagSlice'
import { LocalOffer } from '@mui/icons-material'
import { FormattedMessage } from 'react-intl'

export default () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const tags = useAppSelector(selectAll)
  const status = useAppSelector(getTagStatus)

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
