import { useState } from 'react'
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { FormattedMessage } from 'react-intl'
import { useNavigate } from 'react-router-dom'

export const MoreActionsMenu = () => {
  const [anchorElement, setAnchorElement] = useState<null | HTMLElement>(null)
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)

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
        <MoreVertIcon />
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
        <MenuItem
          onClick={() => {
            setIsOpen(true)
          }}
        >
          <FormattedMessage
            id="button.about"
            defaultMessage={'About Damao Timeline'}
          />
        </MenuItem>
      </Menu>
      <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
        <DialogTitle>
          <FormattedMessage id="about.title" defaultMessage={'About'} />
        </DialogTitle>
        <DialogContent dividers>
          <DialogContentText sx={{ whiteSpace: 'pre-line' }}>
            <FormattedMessage id="about.detail" defaultMessage={'Details'} />
          </DialogContentText>
        </DialogContent>
        <DialogActions></DialogActions>
      </Dialog>
    </>
  )
}
