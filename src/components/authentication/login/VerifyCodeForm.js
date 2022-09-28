import { useSnackbar } from 'notistack5'
import { useNavigate, useParams } from 'react-router-dom'
import { useState } from 'react'
import { Stack } from '@material-ui/core'
import { Form, FormikProvider, useFormik } from 'formik'
// material
import { LoadingButton } from '@material-ui/lab'
import ReactCodeInput from 'react-verification-code-input'
import { makeStyles } from '@material-ui/styles'

import auth_api from 'utils/api/auth'
import storage from 'utils/storage'
import Bugsnag from '@bugsnag/js'
// ----------------------------------------------------------------------

const useStyles = makeStyles((theme) => ({
  inpt: {
    font: 'inherit',
    letterSpacing: 'inherit',
    border: 0,
    boxSizing: 'content-box',
    background: 'none',
    height: '1.4375em',
    margin: theme.spacing(1),
    display: 'block',
    minWidth: 0,
    width: '100%',
    padding: '16.5px 14px',
  },
}))

export default function VerifyCodeForm({ currentStep }) {
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const classes = useStyles()
  const [isLoading, setLoading] = useState(false)
  const [code, setCode] = useState(undefined)
  const params = useParams()

  const formik = useFormik({
    initialValues: {
      code: '',
    },
    onSubmit: async () => {
      setLoading(true)
      if (!code) return setLoading(false)

      const local_store = await storage.getStore()
      const local_user = await storage.getUser()

      if (!local_store || !local_user) return;

      const user = JSON.parse(local_user)
      const store = JSON.parse(local_store)
      if (!user && !store) {
        currentStep(1)
        return setLoading(false)
      }

      const result = await auth_api.verify_phone(user._id, code)
      if (!result.ok) {
        Bugsnag.notify(result)
        alert('Invalid verification code')
        return setLoading(false)
      }

      let { data } = result
      data.token = user.token
      data.sid = params.store

      await storage.storeUser(data)
      await storage.storeToken(data.token)

      setLoading(false)
      enqueueSnackbar('Verify success', { variant: 'success' })
      if (user.isVerified && user.isOnBoarded) {
        navigate(`/dashboard/${store}/app`)
      } else if (user.isVerified && !user.isOnBoarded) {
        navigate(`/${store}/onboard`)
      } else if (!user.isVerified && !user.isOnBoarded) {
        navigate(`/${store}/onboard`)
      }
    },
  })

  const { handleSubmit } = formik

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack direction="row" spacing={2} justifyContent="center" className={'phone-form-container'}>
          <ReactCodeInput onComplete={(e) => setCode(e)} autoFocus={true} className={classes.inpt} />
        </Stack>

        <br />

        <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isLoading} sx={{ mt: 3 }}>
          Verify
        </LoadingButton>
      </Form>
    </FormikProvider>
  )
}
