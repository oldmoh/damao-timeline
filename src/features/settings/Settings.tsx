import { useState } from 'react'
import {
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Switch,
  Typography,
} from '@mui/material'
import { FormattedMessage } from 'react-intl'

import { useAppDispatch, useAppSelector } from '../../common/hooks'
import { getSettings, updateSettings } from './settingsSlice'
import { Language } from '../../app/types'

export default () => {
  const dispatch = useAppDispatch()
  const appSettings = useAppSelector(getSettings)
  const [lang, setLang] = useState(appSettings.lang)

  const handleLanguageChanged = async (event: SelectChangeEvent) => {
    setLang(event.target.value as Language)
    await dispatch(
      updateSettings({ ...appSettings, lang: event.target.value as Language })
    )
  }

  const handlModeSwithced = async () => {
    await dispatch(
      updateSettings({
        ...appSettings,
        theme: appSettings.theme === 'light' ? 'dark' : 'light',
      })
    )
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
            <MenuItem value="zh-TW">
              <FormattedMessage
                id="settings.lang.zh-TW"
                defaultMessage={'Chinese(Taiwan)'}
              />
            </MenuItem>
            <MenuItem value="ja">
              <FormattedMessage
                id="settings.lang.ja"
                defaultMessage={'Japanese'}
              />
            </MenuItem>
          </Select>
        </FormControl>
      </Stack>
      <Stack spacing={2} paddingX={4}>
        <Typography variant="body1">
          <FormattedMessage
            id="settings.darkTheme"
            defaultMessage={'Dark Theme'}
          />
        </Typography>
        <Switch
          onChange={handlModeSwithced}
          checked={appSettings.theme === 'dark'}
        />
      </Stack>
    </Stack>
  )
}
