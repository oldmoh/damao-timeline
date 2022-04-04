import React, { useState } from 'react'
import logo from './logo.svg'
import { Counter } from './features/counter/Counter'
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
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'

function App() {
  const dispatch: AppDispatch = useAppDispatch()
  const buttonHandler = (story: any) =>
    dispatch(
      insertStory({
        title: 'test2',
        happenedAt: new Date().getTime(),
        detail: '',
        tagIds: [1],
        color: '#FFFFFF',
        isArchived: false,
      })
    )
  const button2Handler = (event: any) =>
    dispatch(
      insertTag({
        name: 'good thing',
        description: 'gooooooood',
        color: '#FFFFFF',
      })
    )
  const [isDrawerOpened, setIsDrawerOpened] = useState(false)
  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2 }}
            onClick={() => setIsDrawerOpened(true)}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: 'none', sm: 'block' } }}
          >
            <FormattedMessage defaultMessage="時間軸" id="AppBar" />
          </Typography>
        </Toolbar>
      </AppBar>
      <div>
        <Drawer open={isDrawerOpened} onClose={() => setIsDrawerOpened(false)}>
          <nav>
            <Button>Timeline</Button>
          </nav>
        </Drawer>
        <main>
          {/* <Counter /> */}
          {/* <button onClick={buttonHandler}>haha</button>
          <button onClick={button2Handler}>haha</button> */}
          {/* <FormattedMessage defaultMessage="hahaha" id="hahaha" /> */}
          <MyTimeline />
        </main>
      </div>
    </div>
  )
}

export default App
