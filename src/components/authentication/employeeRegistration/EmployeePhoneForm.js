import * as Yup from 'yup'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useFormik, Form, FormikProvider } from 'formik'
// material
import { Stack, TextField } from '@material-ui/core'
import { LoadingButton } from '@material-ui/lab'

import storage from 'utils/storage'
import useAuth from 'utils/api/auth'
import Bugsnag from '@bugsnag/js'
// ----------------------------------------------------------------------

export default function LoginForm({ currentStep }) {
    const navigate = useNavigate()
    const [isLoading, setLoading] = useState(false)
    const params = useParams()

    const PhoneLoginSchema = Yup.object().shape({
        phone: Yup.string().min(11, 'Not a valid phone number! (ex. 091523468790)').max(11, 'Not a valid phone number! (ex. 091523468790)').required('Phone number is required'),
    })

    const formik = useFormik({
        initialValues: {
            phone: '',
        },
        validationSchema: PhoneLoginSchema,
        onSubmit: async (values) => {
            setLoading(true)
            if (!values.phone) return setLoading(false)

            const result = await useAuth.sign_up_phone(values.phone, params.store)

            if (!result.ok) {
                Bugsnag.notify(result)
                alert(result.data.msg)
                return setLoading(false)
            }

            let { data } = result
            data.sid = params.store ? params.store : data.store_id
            await storage.storeUser(data)
            await storage.storeToken(data.token)
            setLoading(false)
            if (data.verificationCode === null) {
                if (data.isVerified && data.isOnBoarded) {
                    navigate(`/dashboard/app`)
                } else if (data.isVerified && !data.isOnBoarded) {
                    navigate(`/${params.store}/onboard`)
                } else if (!data.isVerified && !data.isOnBoarded) {
                    navigate(`/${params.store}/onboard`)
                }
            } else {
                currentStep(2)
            }
        },
    })

    const { errors, touched, handleSubmit, getFieldProps } = formik

    return (
        <FormikProvider value={formik}>
            <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                <Stack spacing={3} sx={{ mb: 3 }}>
                    <TextField
                        fullWidth
                        type="tel"
                        inputProps={{ maxLength: 11, minLength: 11 }}
                        label="Phone number (ex. 091523468790)"
                        {...getFieldProps('phone')}
                        error={Boolean(touched.phone && errors.phone)}
                        helperText={touched.phone && errors.phone}
                    />
                </Stack>

                <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isLoading}>
                    Register
                </LoadingButton>
            </Form>
        </FormikProvider>
    )
}
