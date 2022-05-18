import React from 'react'
import { useRoutes } from 'react-router-dom'
import EventIcon from '@mui/icons-material/Event'
import BookmarkIcon from '@mui/icons-material/Bookmark'

import Timeline from '../features/timeline/Timeline'
import StoryForm from '../features/timeline/StoryForm'
import Tags from '../features/tag/Tags'
import TagForm from '../features/tag/TagForm'
import NotFoundPage from '../components/NotFoundPage'
import Stories from '../features/timeline/Stories'
import TagTable from '../features/tag/TagTable'

export default () => {
  const routes = useRoutes([
    { path: '/', element: <Timeline /> },
    {
      path: '/stories',
      element: <Stories />,
      children: [
        { path: 'create', element: <StoryForm /> },
        { path: ':storyId', element: <StoryForm /> },
      ],
    },
    {
      path: '/tags',
      element: <Tags />,
      children: [
        { path: 'create', element: <TagForm /> },
        { path: ':tagId', element: <TagForm /> },
        { index: true, element: <TagTable /> },
      ],
    },
    {
      path: '*',
      element: <NotFoundPage />,
    },
  ])
  return routes
}

export type NavLink = {
  to: string
  name: string
  icon?: React.ReactNode
}

export const navLinks: NavLink[] = [
  { to: '/', name: 'Timeline', icon: <EventIcon /> },
  { to: '/tags', name: 'Tags', icon: <BookmarkIcon /> },
]
