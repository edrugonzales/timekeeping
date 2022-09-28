import React, { useState, useEffect } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { styled } from '@material-ui/core/styles'
import { Link, Stack, Container, Typography, Button, Divider } from '@material-ui/core'
import Alert from '@material-ui/lab/Alert'
import AlertTitle from '@material-ui/lab/AlertTitle'
import LocationNeededDialog from '../components/locationDialog'

import Page from '../components/Page'
import { LoginForm, PhoneForm, VerifyCodeForm } from '../components/authentication/login'
import storage from 'utils/storage'

const RootStyle = styled(Page)(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}))

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  display: 'flex',
  minHeight: '90vh',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(12, 0),
}))

export default function Login() {
  const navigation = useNavigate();
  const [isPhoneForm, setPhoneForm] = useState(false)
  const [steps, setSteps] = useState(1)
  const [permission, setPermission] = useState()
  const [user, setUser] = useState([])
  const handleStep = (_v) => {
    setSteps(_v)
  }

  const handleSignOut = async (e) => {
    e.preventDefault()
    await storage.remove()
    navigation('/')
  }
  useEffect(() => {
    const load = async () => {
      const local_user = await storage.getUser()
      if (!local_user) return false
      const user = JSON.parse(local_user);
      setUser(user) 
    }
    load()
  }, [permission])


  return (
    <RootStyle title="Login | Time In">
      <Container maxWidth="sm">
        <ContentStyle>
          {user && (user.role === 1 || user.role === 4) ? (
            <Alert severity="info" sx={{ mb: 5 }}>
              <AlertTitle>Issue</AlertTitle>
              You are currently signed in as Store <br />
              If you wish to sign in as employee kindly —
              <Button
                color="inherit"
                onClick={(e) => {
                  handleSignOut(e)
                }}
              >
                <strong>Sign out</strong>
              </Button>
            </Alert>
          ) : (
            ''
          )}
          <Stack sx={{ mb: 5 }}>
            <Typography variant="h4" gutterBottom>
              {steps === 2 ? 'Verify User' : !isPhoneForm ? 'Sign in using credentials' : 'Sign in using phone'}
            </Typography>
            <Typography sx={{ color: 'text.secondary' }}>
              {steps === 2
                ? 'Kindly check your mobile phone for Six (6) Verification Code.'
                : 'Enter your details below.'}
            </Typography>
          </Stack>

          {!isPhoneForm ? (
            <>
              <LoginForm />
              <Divider sx={{ my: 3 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  OR
                </Typography>
              </Divider>

              <Stack direction="column" spacing={2}>
                <Button fullWidth size="large" color="inherit" variant="outlined" onClick={() => setPhoneForm(true)}>
                  Sign in using Phone
                </Button>

              </Stack>

              {/*<Stack direction="column" spacing={2}>
                <div style={{ margin: '2rem auto', width: '100%', textAlign: 'center' }}>
                  <Typography color="#727272" style={{ textTransform: 'initial' }} variant="body1">
                    Create an account as
                    <Link
                      to={`/store`}
                      component={RouterLink}
                      style={{ marginLeft: '.25rem', width: '100%', textDecoration: 'none' }}
                    >
                      Store owner
                    </Link>
                  </Typography>
                </div>

              </Stack>*/}
            </>
          ) : (
            <>
              {steps === 2 ? (
                <VerifyCodeForm currentStep={handleStep} />
              ) : (
                <>
                  <PhoneForm currentStep={handleStep} />
                  <Divider sx={{ my: 3 }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      OR
                    </Typography>
                  </Divider>
                  <Stack direction="row" spacing={2}>
                    <Button
                      fullWidth
                      size="large"
                      color="inherit"
                      variant="outlined"
                      onClick={() => setPhoneForm(false)}
                    >
                      Sign in using credentials
                    </Button>
                  </Stack>

                </>
              )}
            </>
          )}
        </ContentStyle>
      </Container>
    </RootStyle>
  )
}
