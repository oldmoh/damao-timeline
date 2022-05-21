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
  linkName: string | React.ReactNode
  to: string
  icon?: React.ReactNode
  onClick?: React.MouseEventHandler<HTMLDivElement>
}) => {
  const { linkName, to, icon } = props
  const pathMatch = useMatch(to)

  const activeStyle: SxProps<Theme> = pathMatch ? {} : {}

  return (
    <ListItem to={to} component={Link}>
      <ListItemButton onClick={props.onClick}>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={linkName} />
      </ListItemButton>
    </ListItem>
  )
}
