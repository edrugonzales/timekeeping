import React, { useState, useEffect } from 'react'
import { styled } from '@material-ui/core/styles'
import { Stack, Container, Typography, Button, Link  } from '@material-ui/core'
import { useParams, useNavigate, useLocation, Link as RouterLink } from 'react-router-dom'
import Alert from '@material-ui/lab/Alert'
import AlertTitle from '@material-ui/lab/AlertTitle'

import Page from '../components/Page'
import { VerifyCodeForm } from '../components/authentication/login'
import { EmployeeRegistrationForm, EmployeePhoneForm } from '../components/authentication/employeeRegistration'

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
    minHeight: '100vh',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: theme.spacing(12, 0),
}))

export default function EmployeeRegistration() {
    const [isPhoneForm, setPhoneForm] = useState(false)
    const [isLoginForm, setLoginForm] = useState(false)
    const [steps, setSteps] = useState(1)
    const [user, setUser] = useState([])
    const params = useParams()

    const handleStep = (_v) => {
        setSteps(_v)
    }

    const handleSignOut = async (e) => {
        e.preventDefault()
        let { store } = params
        if (!store) return
        await storage.setStore(store)
        await storage.remove()
        window.location.reload()
    }

    useEffect(() => {
        const load = async () => {
            const local_user = await storage.getUser()
            if (!local_user) return
            const user = JSON.parse(local_user);
            setUser(user)
        }
        load()
    }, [])

    return (
        <RootStyle title="Employee Registration | Time In">
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
                            {!isPhoneForm && !isLoginForm && steps !== 2 ? 'How would you like to register?' : ''}
                            {isPhoneForm && steps !== 2 ? 'Register using Phone number' : ''}
                            {isLoginForm && steps !== 2 ? 'Register using Email and Password' : ''}
                        </Typography>

                        <Typography Typography variant="h4" gutterBottom>
                            {steps === 2 ? 'Verify User' : ''}
                        </Typography>

                        
                    </Stack>

                    {!isPhoneForm && !isLoginForm ? (
                        <>
                            <Stack direction="column" spacing={2}>
                                <Button fullWidth size="large" color="inherit" variant="outlined" onClick={() => setLoginForm(true)}>
                                    Email and Password Credentials
                                </Button>

                                {/* <Divider sx={{ my: 3 }}>
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                        OR
                                    </Typography>
                                </Divider>

                                <Button fullWidth size="large" color="inherit" variant="outlined" onClick={() => setPhoneForm(true)}>
                                    Mobile Phone number
                                </Button> */}
                            </Stack>
                            <Stack direction="column" spacing={2}>
                                <Typography color="#727272"  style={{ textTransform: 'initial', marginTop: '2rem' }} variant="body1">
                                  Already have an account?
                                  <Link
                                    to={`/login`}
                                    component={RouterLink}
                                    style={{ marginLeft: '.25rem', width: '100%', textDecoration: 'none' }}
                                  >
                                    Sign in here
                                  </Link>
                                </Typography>
                            </Stack>
                        </>
                    ) : (
                        ''
                    )}

                    {/* <EmployeeRegistrationForm /> */}
                    {isPhoneForm && steps !== 2 ? (
                        <>
                            <EmployeePhoneForm currentStep={handleStep} />
                            <Stack direction="row" spacing={2} sx={{ my: 3 }}>
                                <Button fullWidth size="large" color="inherit" variant="outlined" onClick={() => setPhoneForm(false)}>
                                    Go Back
                                </Button>
                            </Stack>
                        </>
                    ) : (
                        ''
                    )}

                    {isLoginForm && steps !== 2 ? (
                        <>
                            <EmployeeRegistrationForm currentStep={handleStep} store={params.store} />
                            <Stack direction="row" spacing={2} sx={{ my: 3 }}>
                                <Button fullWidth size="large" color="inherit" variant="outlined" onClick={() => setLoginForm(false)}>
                                    Go Back
                                </Button>
                            </Stack>
                        </>
                    ) : (
                        ''
                    )}

                    {steps === 2 ? <VerifyCodeForm currentStep={handleStep} /> : ''}
                </ContentStyle>
            </Container>
        </RootStyle>
    )
}
