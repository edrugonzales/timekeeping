import * as Yup from 'yup'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFormik, Form, FormikProvider } from 'formik'
import { Icon } from '@iconify/react'
import eyeFill from '@iconify/icons-eva/eye-fill'
import eyeOffFill from '@iconify/icons-eva/eye-off-fill'
// material
import { Stack, Checkbox, TextField, IconButton, InputAdornment, FormControlLabel } from '@material-ui/core'
import { LoadingButton } from '@material-ui/lab'

import storage from 'utils/storage'
import useAuth from 'utils/api/auth'
import Bugsnag from '@bugsnag/js'
// ----------------------------------------------------------------------

export default function LoginForm() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setLoading] = useState(false)

  const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    password: Yup.string().required('Password is required'),
  })

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      remember: true,
    },
    validationSchema: LoginSchema,
    onSubmit: async () => {
      setLoading(true)
      if (!values.email || !values.password) return setLoading(false)

      const result = await useAuth.sign_in_email(values.email, values.password)
      if (!result.ok) {
        Bugsnag.notify(result)
        alert('Invalid username or password')
        return setLoading(false)
      }
      let { data } = result
      if (data.role === 0) {
        data.sid = data.store_id
      }
      if (!JSON.parse(data.isOnBoarded)) {
        setLoading(false)
        return navigate(`/${data.sid}/onboard`)
      }
      resetForm()
      await storage.storeUser(data)
      await storage.storeToken(data.token)
      setLoading(false)
      if (data.role === 1 || data.role === 4) return navigate(`/stores/app`, { replace: true })
      return navigate(`/dashboard/app`, { replace: true })
    },
  })

  const { errors, touched, values, resetForm, handleSubmit, getFieldProps } = formik

  const handleShowPassword = () => {
    setShowPassword((show) => !show)
  }

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            fullWidth
            autoComplete="username"
            type="email"
            label="Email address"
            {...getFieldProps('email')}
            autoFocus
            error={Boolean(touched.email && errors.email)}
            helperText={touched.email && errors.email}
          />

          <TextField
            fullWidth
            autoComplete="current-password"
            type={showPassword ? 'text' : 'password'}
            label="Password"
            {...getFieldProps('password')}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleShowPassword} edge="end">
                    <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            error={Boolean(touched.password && errors.password)}
            helperText={touched.password && errors.password}
          />
        </Stack>

        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
          <FormControlLabel
            control={<Checkbox {...getFieldProps('remember')} checked={values.remember} />}
            label="Remember me"
          />

          {/* <Link component={RouterLink} variant="subtitle2" to="#">
            Forgot password?
          </Link> */}
        </Stack>

        <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isLoading}>
          Login
        </LoadingButton>
      </Form>
    </FormikProvider>
  )
}
