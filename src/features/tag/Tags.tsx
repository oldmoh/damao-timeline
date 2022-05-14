import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Button,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material'
import { Box } from '@mui/system'

import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { selectAll, selectAllTags } from './tagSlice'
import { LocalOffer } from '@mui/icons-material'

export default () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const tags = useAppSelector(selectAll)

  const listItems = tags.map((tag) => (
    <ListItem key={`TimelineTag-${tag.id}`}>
      <ListItemButton onClick={() => navigate(`/tags/${tag.id}`)}>
        <ListItemIcon>
          <LocalOffer sx={{ color: tag.color }} />
        </ListItemIcon>
        <ListItemText>{tag.name}</ListItemText>
        <ListItemText>{tag.description}</ListItemText>
      </ListItemButton>
    </ListItem>
  ))

  useEffect(() => {
    dispatch(selectAllTags())
  }, [])

  return (
    <Box>
      <Typography>Tags</Typography>
      <Divider />
      <Button onClick={() => navigate('/tags/create')} variant="contained">
        新增
      </Button>
      <List>{listItems}</List>
    </Box>
  )
}
