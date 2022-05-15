import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Button,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material'
import { Box } from '@mui/system'

import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { getTagStatus, selectAll, selectAllTags } from './tagSlice'
import { LocalOffer } from '@mui/icons-material'

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
    <Stack spacing={4}>
      <Typography variant="h5">標籤</Typography>
      <Box>
        <Button onClick={() => navigate('/tags/create')} variant="contained">
          新增
        </Button>
      </Box>
      {status === 'loading' && <CircularProgress />}
      {status === 'succeeded' && <List>{listItems}</List>}
    </Stack>
  )
}
