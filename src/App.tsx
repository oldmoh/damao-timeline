import React, { useState } from 'react'
import logo from './logo.svg'
import { Counter } from './features/counter/Counter'
import { Routes, Route, Link } from 'react-router-dom'
import './App.scss'
import { insertStory } from './features/timeline/timelineSlice'
import { AppDispatch } from './app/store'
import { useAppDispatch } from './app/hooks'
import { insertTag } from './features/tag/tagSlice'
import { FormattedMessage } from 'react-intl'
import { MyTimeline } from './features/timeline/MyTimeline'
import {
  AppBar,
  Button,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
  Grid,
  Box,
  // Link,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'

const drawerWidth = 300

function App() {
  const dispatch: AppDispatch = useAppDispatch()
  const [isDrawerOpened, setIsDrawerOpened] = useState(false)

  const drawer = (
    <div>
      <Toolbar />
      <Button>Timeline</Button>
    </div>
  )

  return (
    <Box sx={{ display: 'flex' }}>
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
            <FormattedMessage defaultMessage="時間軸" id="AppBar" />
          </Typography>
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
        <MyTimeline />
      </Box>
    </Box>
  )
}

export default App
