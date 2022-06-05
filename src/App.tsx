import { useMemo, useState } from 'react'
import { IntlProvider, FormattedMessage } from 'react-intl'
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
  Snackbar,
  Alert,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import EventIcon from '@mui/icons-material/Event'
import BookmarkIcon from '@mui/icons-material/Bookmark'
import { ThemeProvider, createTheme } from '@mui/material/styles'

import './App.scss'
import { MoreActionsMenu } from './components/MoreActionsMenu'
import Routes from './routes/Routes'
import ListNavItem from './components/ListNavItem'
import {
  useAppDispatch,
  useAppSelector,
  useI18n,
  useInitializer,
} from './common/hooks'
import { getLanguage, getSettings } from './features/settings/settingsSlice'
import { useNotification } from './features/notification/useNotification'

const drawerWidth = 300

function App() {
  const [isDrawerOpened, setIsDrawerOpened] = useState(false)
  const isInitialized = useInitializer()
  const locale = useAppSelector(getLanguage)
  const messages = useI18n()
  const settings = useAppSelector(getSettings)
  const { isOpen, notification, popNotification, close } = useNotification()

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

  const drawer = (
    <>
      <Toolbar />
      <List>
        <ListNavItem
          key={`nav-index`}
          to={'/'}
          linkName={
            <FormattedMessage id="nav.timeline" defaultMessage={'Timeline'} />
          }
          icon={<EventIcon />}
          onClick={() => setIsDrawerOpened(false)}
        />
        <ListNavItem
          key={`nav-tags`}
          to={'/tags'}
          linkName={<FormattedMessage id="nav.tag" defaultMessage={'Tag'} />}
          icon={<BookmarkIcon />}
          onClick={() => setIsDrawerOpened(false)}
        />
      </List>
    </>
  )

  const appDispatch = useAppDispatch()

  return (
    <IntlProvider messages={messages} locale={locale} defaultLocale="en">
      <ThemeProvider theme={theme}>
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
