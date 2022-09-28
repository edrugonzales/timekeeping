import * as Yup from 'yup'
import { useState } from 'react'
import { Icon } from '@iconify/react'
import { useFormik, Form, FormikProvider } from 'formik'
import eyeFill from '@iconify/icons-eva/eye-fill'
import eyeOffFill from '@iconify/icons-eva/eye-off-fill'
import { useNavigate } from 'react-router-dom'
// material
import { Stack, TextField, IconButton, InputAdornment } from '@material-ui/core'
import { LoadingButton } from '@material-ui/lab'
import { useSnackbar } from 'notistack5'

import useUser from 'utils/api/users'
import storage from 'utils/storage'
import Bugsnag from '@bugsnag/js'
// ----------------------------------------------------------------------

export default function EmployeeRegistrationForm({ store }) {
    const navigate = useNavigate()
    const { enqueueSnackbar } = useSnackbar()
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setLoading] = useState(false)

    const OnboardSchema = Yup.object().shape({
        firstName: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('First name required'),
        lastName: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Last name required'),
        position: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Position required'),
        phone: Yup.string().min(11, 'Not a valid phone number! (ex. 091523468790)').max(11, 'Not a valid phone number! (ex. 091523468790)').required('Phone number is required'),
        email: Yup.string().email('Email must be a valid email address').required('Email is required'),
        password: Yup.string().required('Password is required'),
    })

    const formik = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            email: '',
            position: '',
            phone: '',
            password: '',
        },
        enableReinitialize: true,
        validationSchema: OnboardSchema,
        onSubmit: async (values) => {
            setLoading(true)
            values.company = store

            if (
                !values &&
                (!values?.position ||
                    !values?.phone ||
                    !values?.email ||
                    !values?.firstName ||
                    !values?.lastName ||
                    !values?.password)
            )
                return setLoading(false)

            const result = await useUser.post_employee_register(values)
            if (!result.ok) {
                Bugsnag.notify(result)
                enqueueSnackbar(result.data.msg, { variant: 'error' })
                return setLoading(false)
            }

            const { data } = result
            await storage.storeUser(data)
            await storage.storeToken(data.token);
            enqueueSnackbar('Employee registration success', { variant: 'success' })
            setLoading(false)
            navigate('/dashboard/app', { replace: true })
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
                            autoFocus
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
                        type="tel"
                        inputProps={{ maxLength: 11, minLength: 11 }}
                        label="Phone number"
                        {...getFieldProps('phone')}
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
                        Create account
                    </LoadingButton>
                    
                </Stack>
            </Form>
        </FormikProvider>
    )
}
