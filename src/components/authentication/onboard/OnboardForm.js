import * as Yup from 'yup'
import { useState, useEffect } from 'react'
import { Icon } from '@iconify/react'
import { useFormik, Form, FormikProvider } from 'formik'
import eyeFill from '@iconify/icons-eva/eye-fill'
import eyeOffFill from '@iconify/icons-eva/eye-off-fill'
// material
import { Stack, TextField, IconButton, InputAdornment } from '@material-ui/core'
import { LoadingButton } from '@material-ui/lab'
import { useSnackbar } from 'notistack5'
import { useNavigate, useParams } from 'react-router-dom'


import useUser from 'utils/api/users'
import storage from 'utils/storage'
import Bugsnag from '@bugsnag/js'
// ----------------------------------------------------------------------

export default function OnboardForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setLoading] = useState(false)
  const { enqueueSnackbar } = useSnackbar()
  const navigate = useNavigate()
  const [_u, set_u] = useState({})
  const params = useParams()
  const [token, setToken] = useState('')

  const OnboardSchema = Yup.object().shape({
    firstName: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('First name required'),
    lastName: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Last name required'),
    position: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Position required'),
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    phone: Yup.string().required('Phone number is required'),
    password: Yup.string().required('Password is required'),
  })

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const local_user = await storage.getUser();

      if (!local_user) return
      const user = JSON.parse(local_user);

      if (!user) {
        setLoading(false)
        enqueueSnackbar('Kindly re-login. Session expired', { variant: 'error' })
        navigate(`/login`)
        return
      }

      setToken(user.token)
      set_u(user)
      setLoading(false)
    }

    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      position: '',
      password: '',
      phone: _u.phone ? _u.phone : '',
    },
    enableReinitialize: true,
    validationSchema: OnboardSchema,
    onSubmit: async (values) => {
      setLoading(true)
      if (
        !values.firstName ||
        !values.lastName ||
        !values.email ||
        !values.position ||
        !values.password ||
        !values.phone
      )
        return setLoading(false)
      const store = await useUser.get_user(params.store)
      if (!store.ok) {
        Bugsnag.notify(store)
        setLoading(false)
        return enqueueSnackbar('Store not found!', { variant: 'error' })
      }

      values.company = store.data.company
      const result = await useUser.patch_user_onboard(values, _u._id)
      if (!result.ok) {
        Bugsnag.notify(result)
        setLoading(false)
        return enqueueSnackbar('Unable to process your request', { variant: 'error' })
      }

      result.data.token = token
      result.data.sid = store.data._id

      await storage.storeUser(result.data);
      await storage.storeToken(result.data.token)
      navigate(`/dashboard`, { replace: true })
    },
  })

  const { errors, touched, handleSubmit, getFieldProps } = formik

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              fullWidth
              label="First name"
              {...getFieldProps('firstName')}
              error={Boolean(touched.firstName && errors.firstName)}
              helperText={touched.firstName && errors.firstName}
            />

            <TextField
              fullWidth
              label="Last name"
              {...getFieldProps('lastName')}
              error={Boolean(touched.lastName && errors.lastName)}
              helperText={touched.lastName && errors.lastName}
            />
          </Stack>

          <TextField
            fullWidth
            label="Position"
            {...getFieldProps('position')}
            error={Boolean(touched.position && errors.position)}
            helperText={touched.position && errors.position}
          />

          <TextField
            fullWidth
            label="Phone number"
            {...getFieldProps('phone')}
            disabled
            InputLabelProps={{ shrink: true }}
            error={Boolean(touched.phone && errors.phone)}
            helperText={touched.phone && errors.phone}
          />

          <TextField
            fullWidth
            autoComplete="username"
            type="email"
            label="Email address"
            {...getFieldProps('email')}
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
                  <IconButton edge="end" onClick={() => setShowPassword((prev) => !prev)}>
                    <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            error={Boolean(touched.password && errors.password)}
            helperText={touched.password && errors.password}
          />

          <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isLoading}>
            Submit
          </LoadingButton>
        </Stack>
      </Form>
    </FormikProvider>
  )
}
