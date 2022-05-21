import { useState } from 'react'
import { Button, Box, Menu } from '@mui/material'
import { BlockPicker, ColorChangeHandler } from 'react-color'
import { LocalOffer } from '@mui/icons-material'

export default (props: {
  color: string
  onChangeComplete: ColorChangeHandler
  label?: string | React.ReactNode
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  return (
    <Box>
      <Button variant="text" onClick={handleClick}>
        <LocalOffer sx={{ color: props.color }} />
        {props.label}
      </Button>
      <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
        <BlockPicker
          triangle="hide"
          color={props.color}
          onChangeComplete={props.onChangeComplete}
        />
      </Menu>
    </Box>
  )
}
