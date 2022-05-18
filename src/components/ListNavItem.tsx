import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  SxProps,
  Theme,
} from '@mui/material'
import { Link, useMatch } from 'react-router-dom'

export default (props: {
  linkName: string
  to: string
  icon?: React.ReactNode
}) => {
  const { linkName, to, icon } = props
  const pathMatch = useMatch(to)

  const activeStyle: SxProps<Theme> = pathMatch ? {} : {}

  return (
    <ListItem to={to} component={Link}>
      <ListItemButton>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={linkName} />
      </ListItemButton>
    </ListItem>
  )
}
