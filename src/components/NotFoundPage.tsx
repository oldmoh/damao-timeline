import { Typography } from '@mui/material'
import { FormattedMessage } from 'react-intl'

export default function NotFoundPage() {
  return (
    <Typography variant="h5">
      <FormattedMessage
        id="404.message"
        defaultMessage={'Oops! Page Not found.'}
      />
      🤷‍♂️
    </Typography>
  )
}
