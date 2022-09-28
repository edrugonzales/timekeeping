import {Icon} from '@iconify/react'
import {Link as RouterLink} from 'react-router-dom'
import arrowIosBackFill from '@iconify/icons-eva/arrow-ios-back-fill'
// material
import {styled} from '@material-ui/core/styles'
import {Box, Button, Link, Container, Typography} from '@material-ui/core'
// layouts
import Page from '../components/Page'
import LogoOnlyLayout from '../../layouts/LogoOnlyLayout'
// components
import {VerifyCodeForm} from './../components/authentication/verifyCode'

// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({theme}) => ({
  display: 'flex',
  minHeight: '100%',
  alignItems: 'center',
  padding: theme.spacing(12, 0),
}))

// ----------------------------------------------------------------------

export default function VerifyCode() {
  return (
    <RootStyle title="Verify | Time in ">
      <Container>
        <Box sx={{maxWidth: 480, mx: 'auto'}}>
          <Typography variant="h3" paragraph>
            Please check your mobile phone
          </Typography>
          <Typography sx={{color: 'text.secondary'}}>
            We have emailed a 6-digit confirmation code, please enter the code in below box to verify your email.
          </Typography>

          <Box sx={{mt: 5, mb: 3}}>
            <VerifyCodeForm />
          </Box>

          {/* <Typography variant="body2" align="center">
            Don’t have a code? &nbsp;
            <Link variant="subtitle2" underline="none" onClick={() => {}}>
              Resend code
            </Link>
          </Typography> */}
        </Box>
      </Container>
    </RootStyle>
  )
}
