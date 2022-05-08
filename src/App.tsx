import { useState } from 'react'
import logo from './logo.svg'
import { Routes, Route, Link } from 'react-router-dom'
import './App.scss'
import { AppDispatch } from './app/store'
import { useAppDispatch } from './app/hooks'
import { FormattedMessage } from 'react-intl'
import { MyTimeline } from './features/timeline/MyTimeline'
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
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import EventIcon from '@mui/icons-material/Event'
import { TimelineForm } from './features/timeline/TimelineForm'
import { MoreActionsMenu } from './components/MoreActionsMenu'

const drawerWidth = 300

function App() {
  const dispatch: AppDispatch = useAppDispatch()
  const [isDrawerOpened, setIsDrawerOpened] = useState(false)

  const drawer = (
    <>
      <Toolbar />
      <List>
        <ListItem component={Link} to="/" color="inherit">
          <ListItemButton>
            <ListItemIcon>
              <EventIcon />
            </ListItemIcon>
            Timeline
          </ListItemButton>
        </ListItem>
      </List>
    </>
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
        <Routes>
          <Route path="/" element={<MyTimeline />} />
          <Route path="/story/create" element={<TimelineForm />} />
          <Route path="/story/:storyId" element={<TimelineForm />} />
          <Route path="/story/:storyId/update" element={<TimelineForm />} />
        </Routes>
      </Box>
    </Box>
  )
}

export default App
