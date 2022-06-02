import React, { forwardRef } from 'react'
import { Card, CardContent, Skeleton, Stack } from '@mui/material'
import {
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
} from '@mui/lab'

export default forwardRef<Element, {}>(({}, ref) => {
  return (
    <TimelineItem ref={ref}>
      <TimelineOppositeContent
        sx={{ display: { xs: 'none', md: 'block' }, margin: 'auto 0' }}
      >
        <Skeleton variant="text" width={150} sx={{ marginLeft: 'auto' }} />
      </TimelineOppositeContent>
      <TimelineSeparator>
        <TimelineConnector />
        <TimelineDot />
        <TimelineConnector />
      </TimelineSeparator>
      <TimelineContent>
        <Card>
          <CardContent>
            <Stack spacing={1}>
              <Skeleton variant="text" height={40} width={200} />
              <Skeleton variant="text" width={150} />
              <Skeleton variant="text" height={32} />
              <Skeleton variant="rectangular" />
            </Stack>
          </CardContent>
        </Card>
      </TimelineContent>
    </TimelineItem>
  )
})
