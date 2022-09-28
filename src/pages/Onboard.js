// material
import { styled } from '@material-ui/core/styles'
import { Link, Container, Typography, Stack } from '@material-ui/core'
// layouts
// components
import Page from '../components/Page'
import { OnboardForm } from '../components/authentication/onboard'

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

export default function Onboard() {
  return (
    <RootStyle title="Onboard | Time In">
      <Container>
        <ContentStyle>
          <Stack sx={{ mb: 5 }}>
            <Typography variant="h4" gutterBottom>
              Employee onboarding process...
            </Typography>
            <Typography sx={{ color: 'text.secondary' }}>Enter your details below.</Typography>
          </Stack>

          <OnboardForm />

          <Typography variant="body2" align="center" sx={{ color: 'text.secondary', mt: 3 }}>
            By registering, I agree to Sparkle Time In
            <Link underline="always" sx={{ color: 'text.primary' }}>
              Terms of Service
            </Link>
            <Link underline="always" sx={{ color: 'text.primary' }}>
              Privacy Policy
            </Link>
          </Typography>
        </ContentStyle>
      </Container>
    </RootStyle>
  )
}
