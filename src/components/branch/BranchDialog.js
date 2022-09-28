import * as Yup from 'yup';
import { Form, FormikProvider, useFormik } from 'formik';
import { useSnackbar } from 'notistack5'
import React, { useEffect, useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogContentText,
    DialogTitle,
    DialogActions,
    TextField,
    Stack,
    Button,
} from '@material-ui/core'
import { LoadingButton } from '@material-ui/lab';

import storage from 'utils/storage'
import user_api from 'utils/api/users'
import Bugsnag from '@bugsnag/js'

const BranchDialog = ({ open, handleClose }) => {
    const { enqueueSnackbar } = useSnackbar()
    const [user, setUser] = useState([])

    useEffect(() => {
        const load = async () => {
            const local_user = await storage.getUser()
            if (!local_user) return enqueueSnackbar('Unable to proceed, Kindly Re-log again', { variant: 'warning' })
            const user = JSON.parse(local_user)
            setUser(user)
        }

        load()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const NewCardSchema = Yup.object().shape({
        name: Yup.string().required('Branch name is required'),
    });

    const formik = useFormik({
        initialValues: {
            name: '',
            uid: '',
        },
        validationSchema: NewCardSchema,
        onSubmit: async () => {
            if (!values.name) return enqueueSnackbar('Missing Fields', { variant: 'error' });

            const form_data = {
                name: values.name,
                uid: user._id,
            }
            const result = await user_api.post_branch(form_data);
            if (!result.ok) 
            {
                Bugsnag.notify(result)   
                return enqueueSnackbar('Unable to save new billing details', { variant: 'error' });
            }
            resetForm();
            enqueueSnackbar('Change of billing details success', { variant: 'success' });
            window.location.reload();
        }
    });
    const { errors, touched, values, isSubmitting, resetForm, handleSubmit, getFieldProps } = formik;

    return (
        <div>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Create new branch</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        When New branch is created. New QR Code will be provided for the Employee's of that branch to Scan and Register to.
                    </DialogContentText>
                    <FormikProvider value={formik}>
                        <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
                            <Stack spacing={3}>
                                <Stack direction={{ xs: 'column', sm: 'column' }} spacing={2} sx={{ mt: 3 }}>
                                    <TextField
                                        fullWidth
                                        required
                                        label="Branch Name"
                                        {...getFieldProps('name')}
                                        error={Boolean(touched.name && errors.name)}
                                        helperText={touched.name && errors.name}
                                    />
                                </Stack>


                                <DialogActions>
                                    <Button type="button" color="inherit" variant="outlined">
                                        Cancel
                                    </Button>
                                    <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                                        Submit
                                    </LoadingButton>
                                </DialogActions>


                            </Stack>
                        </Form>
                    </FormikProvider>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default BranchDialog
