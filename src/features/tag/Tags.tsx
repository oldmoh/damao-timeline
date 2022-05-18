import { Stack, Typography } from '@mui/material'
import { Outlet } from 'react-router-dom'

export default () => {
  return (
    <Stack spacing={4}>
      <Typography variant="h5">標籤</Typography>
      <Outlet />
    </Stack>
  )
}
