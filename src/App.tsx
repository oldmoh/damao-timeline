import { useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import {
  AppBar,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
  Box,
  List,
  CssBaseline,
  CircularProgress,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'

import './App.scss'
import { MoreActionsMenu } from './components/MoreActionsMenu'
import Routes, { navLinks } from './routes/Routes'
import ListNavItem from './components/ListNavItem'
import { useAppSelector, useI18n, useInitializer } from './common/hooks'
import { IntlProvider } from 'react-intl'
import { getLanguage } from './features/settings/settingsSlice'

const drawerWidth = 300

function App() {
  const [isDrawerOpened, setIsDrawerOpened] = useState(false)
  const isInitialized = useInitializer()
  const locale = useAppSelector(getLanguage)
  const messages = useI18n()

  const drawer = (
    <>
      <Toolbar />
      <List>
        {navLinks.map((link) => (
          <ListNavItem
            key={`nav-${link.to}`}
            to={link.to}
            linkName={link.name}
            icon={link.icon}
          />
        ))}
      </List>
    </>
  )

  return (
    <IntlProvider messages={messages} locale={locale} defaultLocale="en">
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
              <FormattedMessage defaultMessage="Timeline" id="app.title" />
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
          {!isInitialized && <CircularProgress />}
          {isInitialized && <Routes />}
        </Box>
      </Box>
    </IntlProvider>
  )
}

export default App
