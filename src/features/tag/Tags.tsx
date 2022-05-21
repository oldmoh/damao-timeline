import { Stack, Typography } from '@mui/material'
import { FormattedMessage } from 'react-intl'
import { Outlet } from 'react-router-dom'

export default () => {
  return (
    <Stack spacing={4}>
      <Typography variant="h5">
        <FormattedMessage id="tags.title" defaultMessage={'Tag'} />
      </Typography>
      <Outlet />
    </Stack>
  )
}
