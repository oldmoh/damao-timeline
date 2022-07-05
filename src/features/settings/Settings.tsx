import { useState } from 'react'
import {
  Button,
  ButtonGroup,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Switch,
  Typography,
} from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { FormattedMessage, useIntl } from 'react-intl'
import { Helmet } from 'react-helmet'

import { useAppDispatch, useAppSelector } from '../../common/hooks'
import { getSettings, resetDatabase, updateSettings } from './settingsSlice'
import { Language } from '../../app/types'

export default () => {
  const intl = useIntl()
  const dispatch = useAppDispatch()
  const appSettings = useAppSelector(getSettings)
  const [isReseting, setIsReseting] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const handleLanguageChanged = async (event: SelectChangeEvent) => {
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

  const handleDialogClose = () => setIsOpen(false)

  return (
    <>
      <Helmet>
        <title>
          {intl.formatMessage({
            id: 'settings.title',
            defaultMessage: 'Settings',
          })}
          - Big Cat
        </title>
      </Helmet>
      <Stack spacing={4}>
        <Typography variant="h5">
          <FormattedMessage id="settings.title" defaultMessage={'Settings'} />
        </Typography>
        <Stack spacing={2} paddingX={4}>
          <Typography variant="body1">
            <FormattedMessage id="settings.lang" defaultMessage={'Language'} />
          </Typography>
          <FormControl>
            <Select value={appSettings.lang} onChange={handleLanguageChanged}>
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
          <Typography variant="body1">
            <FormattedMessage
              id="settings.reset"
              defaultMessage={'Clear and reset all data'}
            />
          </Typography>
          <ButtonGroup>
            <LoadingButton
              loading={isReseting}
              loadingIndicator={
                <Typography variant="body1">
                  <FormattedMessage
                    id="settings.reset.button.loading"
                    defaultMessage={'Reseting'}
                  />
                </Typography>
              }
              onClick={() => setIsOpen(true)}
              variant="contained"
              color="error"
              sx={{ display: 'block' }}
            >
              <Typography variant="body1">
                <FormattedMessage
                  id="settings.reset.button"
                  defaultMessage={'Reset'}
                />
              </Typography>
            </LoadingButton>
          </ButtonGroup>
        </Stack>
      </Stack>
      <Dialog open={isOpen} onClose={handleDialogClose}>
        <DialogTitle>
          <FormattedMessage
            id="settings.reset.button"
            defaultMessage={'Reset'}
          />
        </DialogTitle>
        <DialogContent>
          <FormattedMessage
            id="settings.reset.detail"
            defaultMessage={'Reset'}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={async () => {
              handleDialogClose()
              setIsReseting(true)
              await dispatch(resetDatabase())
              setIsReseting(false)
            }}
          >
            <FormattedMessage
              id="settings.reset.button"
              defaultMessage={'Reset'}
            />
          </Button>
          <Button onClick={handleDialogClose}>
            <FormattedMessage
              id="settings.reset.button.cancel"
              defaultMessage={'Cancel'}
            />
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
