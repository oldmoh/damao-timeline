import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  SxProps,
  Theme,
} from '@mui/material'
import { forwardRef, useMemo } from 'react'
import { Link, LinkProps, useMatch } from 'react-router-dom'

export default (props: {
  linkName: string | React.ReactNode
  to: string
  icon?: React.ReactNode
  onClick?: React.MouseEventHandler<HTMLDivElement>
}) => {
  const { linkName, to, icon } = props
  const pathMatch = useMatch(to)

  const activeStyle: SxProps<Theme> = pathMatch ? {} : {}

  const WrappedLink = useMemo(
    () =>
      forwardRef<HTMLAnchorElement, Omit<LinkProps, 'to'>>((linkProps, ref) => {
        return <Link ref={ref} to={to} {...linkProps} />
      }),
    [to]
  )

  return (
    <ListItem component={WrappedLink}>
      <ListItemButton onClick={props.onClick} TouchRippleProps={{}}>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText
          primary={linkName}
          primaryTypographyProps={{
            color: 'primary',
            variant: 'body1',
            fontWeight: 600,
          }}
        />
      </ListItemButton>
    </ListItem>
  )
}
