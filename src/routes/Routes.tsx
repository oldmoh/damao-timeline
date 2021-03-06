import { useRoutes } from 'react-router-dom'

import Timeline from '../features/timeline/Timeline'
import UpdateStoryForm from '../features/timeline/UpdateStoryForm'
import Tags from '../features/tag/Tags'
import TagForm from '../features/tag/TagForm'
import NotFoundPage from '../components/NotFoundPage'
import Stories from '../features/timeline/Stories'
import TagTable from '../features/tag/TagTable'
import Settings from '../features/settings/Settings'
import Story from '../features/timeline/Story'
import AddStoryForm from '../features/timeline/AddStoryForm'

export default () => {
  const routes = useRoutes([
    { path: '/', element: <Timeline /> },
    {
      path: '/stories',
      element: <Stories />,
      children: [
        { path: 'create', element: <AddStoryForm /> },
        { path: ':storyId', element: <Story /> },
        { path: ':storyId/update', element: <UpdateStoryForm /> },
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
