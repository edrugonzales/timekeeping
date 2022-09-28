import React, {useEffect, useState} from 'react'
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@material-ui/core'
import storage from 'utils/storage'
import discord_api from 'utils/api/discord'
import {Formik, useField} from 'formik'
import * as yup from 'yup'

import {useSnackbar} from 'notistack5'
import Bugsnag from '@bugsnag/js'

const validationSchema = yup.object({
  name: yup.string().max(50, 'Too long').required(),
  email: yup.string().email('Invalid email').required(),
  phone: yup.string().max(20, 'Too long').required(),
  issue: yup.string().required(),
})

const CustomTextField = ({type, label, placeholder, InputProps, ...props}) => {
  const [field, meta] = useField(props)
  const errorText = meta.error && meta.touched ? meta.error : ''
  return (
    <TextField
      label={label}
      type={type}
      variant="standard"
      fullWidth
      margin="dense"
      required
      placeholder={placeholder}
      {...field}
      helperText={errorText}
      error={!!errorText}
      InputProps={InputProps}
    />
  )
}

const CustomMultiLineTextField = ({type, label, placeholder, InputProps, ...props}) => {
  const [field, meta] = useField(props)
  const errorText = meta.error && meta.touched ? meta.error : ''
  return (
    <TextField
      label={label}
      type={type}
      variant="standard"
      fullWidth
      margin="dense"
      multiline
      rows={4}
      required
      placeholder={placeholder}
      {...field}
      helperText={errorText}
      error={!!errorText}
      InputProps={InputProps}
    />
  )
}

const DiscordDialog = ({open, handleClose}) => {
  const {enqueueSnackbar} = useSnackbar()
  const [user, setUser] = useState([])

  useEffect(() => {
    const load = async () => {
      const local_user = await storage.getUser()
      if (!local_user) return enqueueSnackbar('Unable to proceed, Kindly Re-log again', {variant: 'warning'})
      const user = JSON.parse(local_user)
      setUser(user)
    }

    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Need help?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please tell us what happen and we will get back to you as soon as possible
          </DialogContentText>
          <Formik
            initialValues={{
              name: `${user.firstName} ${user.lastName}`,
              email: `${user.email}`,
              phone: `${user.phone}`,
            }}
            validationSchema={validationSchema}
            onSubmit={async (data, {setSubmitting}) => {
              setSubmitting(true)
              let params = JSON.stringify({
                username: 'Captain Sparkle',
                avatar_url:
                  'https://www.sparkles.com.ph/static/2629bb8535ba6ae5406fc9385dadc2e0/497c6/Spark--noodles.png',
                content: ` Time In Help - Version 2 \n**from:**\n ${data.name} - ${user.company} \n**Email:**\n ${data.email}\n**Phone:**\n ${data.phone} \n**Issue:**\n ${data.issue}`,
              })

              console.log(data)

              const result = await discord_api.send_message(params)

              if (!result.ok) 
              {
                Bugsnag.notify(result)
                return enqueueSnackbar('Unable to submit your request for assitance', {variant: 'error'})
              }
              setSubmitting(false)
              handleClose()
              return enqueueSnackbar('Thank you for your patience, we will contact you ASAP.', {variant: 'success'})
            }}
          >
            {({values, handleChange, handleSubmit, isSubmitting}) => (
              <form onSubmit={handleSubmit}>
                
                <CustomTextField
                  autoFocus
                  margin="dense"
                  name="name"
                  label="Name"
                  fullWidth
                  variant="standard"
                  onChange={handleChange}
                />
                <CustomTextField
                  autoFocus
                  margin="dense"
                  name="phone"
                  label="Phone"
                  fullWidth
                  variant="standard"
                  onChange={handleChange}
                />
                <CustomTextField
                  autoFocus
                  margin="dense"
                  name="email"
                  label="Email Address"
                  type="email"
                  fullWidth
                  variant="standard"
                  onChange={handleChange}
                />
                <CustomMultiLineTextField
                  autoFocus
                  margin="dense"
                  name="issue"
                  label="Inquiry/Issue"
                  fullWidth
                  multiline
                  rows={4}
                  variant="standard"
                  onChange={handleChange}
                />
               
                <DialogActions>
                  <Button onClick={handleClose}>Cancel</Button>
                  <Button type="submit" disabled={isSubmitting}  >
                    {isSubmitting ? <CircularProgress /> : 'Send'}
                  </Button>
                </DialogActions>
              </form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default DiscordDialog
