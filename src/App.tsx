import { useState } from 'react'
import { Link, useLocation, useMatch } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
import {
  AppBar,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemButton,
  CssBaseline,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'

import './App.scss'
import { MoreActionsMenu } from './components/MoreActionsMenu'
import Routes, { navLinks } from './app/Routes'
import ListNavItem from './components/ListNavItem'

const drawerWidth = 300

function App() {
  const [isDrawerOpened, setIsDrawerOpened] = useState(false)
  const locatoin = useLocation()
  const currentPathName = navLinks.filter(
    (link) => link.to === locatoin.pathname
  )[0].name

  const drawer = (
    <>
      <Toolbar />
      <List>
        {navLinks.map((link) =>
          link.icon ? (
            <ListNavItem to={link.to} linkName={link.name} icon={link.icon} />
          ) : (
            <ListNavItem to={link.to} linkName={link.name} />
          )
        )}
      </List>
    </>
  )

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2, display: { xs: 'block', sm: 'none' } }}
            onClick={() => setIsDrawerOpened((isOpened) => !isOpened)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            <FormattedMessage defaultMessage={currentPathName} id="AppBar" />
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <MoreActionsMenu />
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          open={isDrawerOpened}
          onClose={() => setIsDrawerOpened(false)}
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
          {drawer}
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
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        <Routes />
      </Box>
    </Box>
  )
}

export default App
