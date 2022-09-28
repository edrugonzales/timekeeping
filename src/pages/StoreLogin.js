import React, { useEffect } from 'react'
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom'

import { styled } from '@material-ui/core/styles'
import { Stack, Container, Typography, Link, Button } from '@material-ui/core'

import Page from '../components/Page'
import AuthSocial from '../components/authentication/AuthSocial'

import { url_search } from 'utils/query'
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

export default function StoreLogin() {

  const navigate = useNavigate()
  const params = url_search(useLocation().search)
  const load = async () => {
    const local_user = await storage.getUser()
    if (local_user) {
      const user = JSON.parse(local_user);
      const verified = user ? JSON.parse(user.isVerified) : undefined
      const onboard = user ? JSON.parse(user.isOnBoarded) : undefined

      if (verified && onboard) {
        return navigate(`/stores/app`)
      } else {
        return navigate(`/store/onboard`)
      }
    }


  }

  const check_google_login = async () => {
    if (Object.keys(params).length === 0) return
    let { isOnBoarded, isVerified, role } = params
    params.isOnBoarded = JSON.parse(isOnBoarded)
    params.isVerified = JSON.parse(isVerified)
    params.role = JSON.parse(role)

    await storage.setUser(params)
    if (isOnBoarded === 'false') return navigate('/store/onboard', { replace: true })
    return navigate(`/stores/app`, { replace: true })
  }


  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    check_google_login()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params])

  return (
    <RootStyle title="Store Registration | Time In">
      <Container maxWidth="sm">
        <ContentStyle>

          <Stack sx={{ mb: 5 }}>
            <Typography variant="h4" gutterBottom>
              Store Registration
            </Typography>
            <Typography sx={{ color: 'text.secondary' }}>Select sign-up option</Typography>
          </Stack>
          <AuthSocial />

          <Link
            to={`/store/create`}
            component={RouterLink}
            color="inherit"
            style={{ marginLeft: '.25rem', width: '100%', textDecoration: 'none' }}
          >
            <Button fullWidth size="large" color="inherit" variant="outlined">
              Sign up using credentials
            </Button>
          </Link>

          <div style={{ margin: '2rem auto', width: '100%', textAlign: 'center' }}>
            <Typography color="#727272" style={{ textTransform: 'initial' }} variant="body1">
              I already have an account
              <Link
                to={`/login`}
                component={RouterLink}
                style={{ marginLeft: '.25rem', width: '100%', textDecoration: 'none' }}
              >
                Sign in here
              </Link>
            </Typography>
          </div>
        </ContentStyle>
      </Container>
    </RootStyle>
  )
}
