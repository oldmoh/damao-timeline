import React from 'react'
import logo from './logo.svg'
import { Counter } from './features/counter/Counter'
import './App.scss'
import { insertEvent } from './features/timeline/timelineSlice'
import { AppDispatch } from './app/store'
import { useAppDispatch } from './app/hooks'
import { insertTag } from './features/tag/tagSlice'
import { FormattedMessage } from 'react-intl'

function App() {
  const dispatch: AppDispatch = useAppDispatch()
  const buttonHandler = (event: any) =>
    dispatch(
      insertEvent({
        title: 'test2',
        happenedAt: '2022/03/28 16:11:30',
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
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <Counter />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <span>
          <span>Learn </span>
          <a
            className="App-link"
            href="https://reactjs.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            React
          </a>
          <span>, </span>
          <a
            className="App-link"
            href="https://redux.js.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Redux
          </a>
          <span>, </span>
          <a
            className="App-link"
            href="https://redux-toolkit.js.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Redux Toolkit
          </a>
          ,<span> and </span>
          <a
            className="App-link"
            href="https://react-redux.js.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            React Redux
          </a>
          <button onClick={buttonHandler}>haha</button>
          <button onClick={button2Handler}>haha</button>
          <FormattedMessage defaultMessage="hahaha" id="hahaha" />
        </span>
      </header>
    </div>
  )
}

export default App
