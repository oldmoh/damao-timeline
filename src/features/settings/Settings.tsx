import { useState } from 'react'
import {
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Typography,
} from '@mui/material'
import { FormattedMessage } from 'react-intl'

import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { getSettings, Language, setLanguage } from './settingsSlice'

export default () => {
  const dispatch = useAppDispatch()
  const appSettings = useAppSelector(getSettings)
  const [lang, setLang] = useState(appSettings.lang)

  const handleLanguageChanged = (event: SelectChangeEvent) => {
    setLang(event.target.value as Language)
    dispatch(setLanguage(event.target.value as Language))
  }

  return (
    <Stack spacing={4}>
      <Typography variant="h5">
        <FormattedMessage id="settings.title" defaultMessage={'Settings'} />
      </Typography>
      <Stack spacing={2} paddingX={4}>
        <Typography variant="body1">
          <FormattedMessage id="settings.lang" defaultMessage={'Language'} />
        </Typography>
        <FormControl>
          <Select value={lang} onChange={handleLanguageChanged}>
            <MenuItem value="en">
              <FormattedMessage
                id="settings.lang.en"
                defaultMessage={'English'}
              />
            </MenuItem>
            <MenuItem value="cn">
              <FormattedMessage
                id="settings.lang.cn"
                defaultMessage={'Chinese'}
              />
            </MenuItem>
            <MenuItem value="jp">
              <FormattedMessage
                id="settings.lang.jp"
                defaultMessage={'Japanese'}
              />
            </MenuItem>
          </Select>
        </FormControl>
      </Stack>
    </Stack>
  )
}
