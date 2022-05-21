import { useState } from 'react'

import { IconButton, Menu, MenuItem } from '@mui/material'
import SettingsIcon from '@mui/icons-material/Settings'
import { FormattedMessage } from 'react-intl'
import { useNavigate } from 'react-router-dom'

export const MoreActionsMenu = () => {
  const [anchorElement, setAnchorElement] = useState<null | HTMLElement>(null)
  const navigate = useNavigate()

  const isOpened = Boolean(anchorElement)
  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElement(event.currentTarget)
  }
  const handleClose = () => setAnchorElement(null)
  const handleClick = () => {
    setAnchorElement(null)
    navigate('/settings')
  }

  return (
    <>
      <IconButton
        size="large"
        aria-label="display more actions"
        edge="end"
        color="inherit"
        onClick={handleOpen}
        aria-controls={isOpened ? 'more-actions-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={isOpened ? 'true' : undefined}
      >
        <SettingsIcon />
      </IconButton>
      <Menu
        id="more-actions-menu"
        anchorEl={anchorElement}
        open={isOpened}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={handleClick}>
          <FormattedMessage id="button.settings" defaultMessage={'Settings'} />
        </MenuItem>
      </Menu>
    </>
  )
}
