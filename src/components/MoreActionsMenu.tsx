import { useState } from 'react'

import { IconButton, Menu, MenuItem } from '@mui/material'
import SettingsIcon from '@mui/icons-material/Settings'

export const MoreActionsMenu = () => {
  const [anchorElement, setAnchorElement] = useState<null | HTMLElement>(null)

  const isOpened = Boolean(anchorElement)
  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElement(event.currentTarget)
  }
  const handleClose = () => setAnchorElement(null)
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
        <MenuItem onClick={handleClose}>Settings</MenuItem>
      </Menu>
    </>
  )
}
