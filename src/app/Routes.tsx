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
import { FormattedMessage } from 'react-intl'
import Settings from '../features/settings/Settings'

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
      path: '/settings',
      element: <Settings />,
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
  name: string | React.ReactNode
  icon?: React.ReactNode
}

export const navLinks: NavLink[] = [
  {
    to: '/',
    name: <FormattedMessage id="nav.timeline" defaultMessage={'Timeline'} />,
    icon: <EventIcon />,
  },
  {
    to: '/tags',
    name: <FormattedMessage id="nav.tag" defaultMessage={'Tag'} />,
    icon: <BookmarkIcon />,
  },
]
