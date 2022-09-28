// material
import {styled} from '@material-ui/core/styles'
import {Stack, Link, Container, Typography} from '@material-ui/core'
// layouts
// components
import Page from '../components/Page'
import {StoreOnboardForm} from '../components/authentication/storeOnboard'

// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({theme}) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}))

const ContentStyle = styled('div')(({theme}) => ({
  maxWidth: 480,
  margin: 'auto',
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(12, 0),
}))

// ----------------------------------------------------------------------

export default function StoreOnboard() {
  return (
    <RootStyle title="Store Onboard | Time In">
      <Container>
        <ContentStyle>
          <Stack sx={{mb: 5}}>
            <Typography variant="h4" gutterBottom>
              Store Onboarding process...
            </Typography>
            <Typography sx={{color: 'text.secondary'}}>Enter your details below.</Typography>
          </Stack>
          <StoreOnboardForm />

          <Typography variant="body2" align="center" sx={{color: 'text.secondary', mt: 3}}>
            By registering, I agree to Minimal&nbsp;
            <Link underline="always" sx={{color: 'text.primary'}}>
              Terms of Service
            </Link>
            &nbsp;and&nbsp;
            <Link underline="always" sx={{color: 'text.primary'}}>
              Privacy Policy
            </Link>
            .
          </Typography>
        </ContentStyle>
      </Container>
    </RootStyle>
  )
}
