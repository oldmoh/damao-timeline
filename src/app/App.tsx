import { useMemo, useState } from 'react'
import { IntlProvider, FormattedMessage } from 'react-intl'
import {
  AppBar,
  IconButton,
  Toolbar,
  Typography,
  Box,
  List,
  CssBaseline,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import EventIcon from '@mui/icons-material/Event'
import BookmarkIcon from '@mui/icons-material/Bookmark'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { Helmet } from 'react-helmet'

import { MoreActionsMenu } from '../components/MoreActionsMenu'
import Routes from '../routes/Routes'
import ListNavItem from '../components/ListNavItem'
import { useAppSelector, useI18n, useInitializer } from '../common/hooks'
import { getLanguage, getSettings } from '../features/settings/settingsSlice'
import { useNotification } from '../features/notification/useNotification'
import Drawer, { drawerWidth } from '../components/Drawer'

function App() {
  const isInitialized = useInitializer()
  const locale = useAppSelector(getLanguage)
  const settings = useAppSelector(getSettings)
  const messages = useI18n()
  const { isOpen, notification, popNotification, close } = useNotification()
  const [isDrawerOpened, setIsDrawerOpened] = useState(false)

  const theme = useMemo(() => {
    return createTheme({
      palette: {
        mode: settings.theme,
        primary: {
          main: '#f39800',
        },
        secondary: {
          main: '#44617b',
        },
      },
    })
  }, [settings.theme])

  return (
    <IntlProvider messages={messages} locale={locale} defaultLocale="en">
      <ThemeProvider theme={theme}>
        <Helmet htmlAttributes={{ lang: settings.lang }}></Helmet>
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
          <Drawer
            open={isDrawerOpened}
            onClose={() => setIsDrawerOpened((isOpen) => !isOpen)}
          >
            <Toolbar />
            <List>
              <ListNavItem
                key={`nav-index`}
                to={'/'}
                linkName={
                  <FormattedMessage
                    id="nav.timeline"
                    defaultMessage={'Timeline'}
                  />
                }
                icon={<EventIcon />}
                onClick={() => setIsDrawerOpened(false)}
              />
              <ListNavItem
                key={`nav-tags`}
                to={'/tags'}
                linkName={
                  <FormattedMessage id="nav.tag" defaultMessage={'Tag'} />
                }
                icon={<BookmarkIcon />}
                onClick={() => setIsDrawerOpened(false)}
              />
            </List>
          </Drawer>
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              p: 3,
              width: { sm: `calc(100% - ${drawerWidth}px)` },
              position: 'relative',
            }}
          >
            <Toolbar />
            {!isInitialized && <CircularProgress />}
            {isInitialized && <Routes />}
          </Box>
          <Snackbar
            open={isOpen}
            autoHideDuration={4000}
            onClose={() => close()}
            TransitionProps={{ onExited: () => popNotification() }}
          >
            <Alert
              severity={notification?.type ?? 'info'}
              sx={{ width: '100%' }}
              elevation={6}
              variant="standard"
            >
              {notification?.message}
            </Alert>
          </Snackbar>
        </Box>
      </ThemeProvider>
    </IntlProvider>
  )
}

export default App
