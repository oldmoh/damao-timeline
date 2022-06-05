import { ReactNode } from 'react'
import { Box, Drawer } from '@mui/material'

export const drawerWidth = 300

export default (props: {
  children: ReactNode
  open: boolean
  onClose?: () => void
}) => {
  const { children, open, onClose } = props
  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
    >
      <Drawer
        open={open}
        onClose={onClose}
        variant="temporary"
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
          },
        }}
      >
        {children}
      </Drawer>
      <Drawer
        open
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
          },
        }}
      >
        {children}
      </Drawer>
    </Box>
  )
}
