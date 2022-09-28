// material
import { styled } from '@material-ui/core/styles'
import { Stack, Link, Container, Typography } from '@material-ui/core'
import { Link as RouterLink } from 'react-router-dom'
// layouts
// components
import Page from '../components/Page'
import { StoreRegistrationForm } from '../components/authentication/storeRegistration'

// ----------------------------------------------------------------------

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

// ----------------------------------------------------------------------

export default function StoreRegistration() {
  return (
    <RootStyle title="Create new account | Time In">
      <Container>
        <ContentStyle>
          <Stack sx={{ mb: 5 }}>
            <Typography variant="h4" gutterBottom>
              Create store account
            </Typography>
            <Typography sx={{ color: 'text.secondary' }}>Enter your details below.</Typography>
          </Stack>
          <StoreRegistrationForm />

          <Typography variant="body2" align="center" sx={{ color: 'text.secondary', mt: 3 }}>
            By registering, I agree to Sparkle Time In&nbsp;
            <Link underline="always" sx={{ color: 'text.primary' }}>
              Terms of Service
            </Link>
            &nbsp;and&nbsp;
            <Link underline="always" sx={{ color: 'text.primary' }}>
              Privacy Policy
            </Link>
            .
          </Typography>


          <div style={{ margin: '2rem auto', width: '100%', textAlign: 'center' }}>
            <Typography color="#727272" style={{ textTransform: 'initial' }} variant="body1">
              I already have an account
              <Link
                to={`/login`}
                component={RouterLink}
                style={{ marginLeft: '.25rem', width: '100%', textDecoration: 'none' }}
              >
                Go back
              </Link>
            </Typography>
          </div>

        </ContentStyle>
      </Container>
    </RootStyle>
  )
}
