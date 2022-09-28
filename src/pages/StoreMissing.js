import { useEffect } from 'react'
import { motion } from 'framer-motion'
// material
import { styled } from '@material-ui/core/styles'
import { Box, Typography, Container } from '@material-ui/core'
// components
import { MotionContainer, varBounceIn } from '../components/animate'
import Page from '../components/Page'

import storage from 'utils/storage'
// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({ theme }) => ({
  display: 'flex',
  minHeight: '100%',
  alignItems: 'center',
  paddingTop: theme.spacing(15),
  paddingBottom: theme.spacing(10),
}))

// ----------------------------------------------------------------------

export default function StoreMissing() {
  useEffect(() => {
    const load = async () => {
      await storage.remove()
    }
    load()
  }, [])

  return (
    <RootStyle title="Store Not Found | Time In">
      <Container>
        <MotionContainer initial="initial" open>
          <Box sx={{ maxWidth: 480, margin: 'auto', textAlign: 'center' }}>
            <motion.div variants={varBounceIn}>
              <Typography variant="h3" paragraph>
                Oops... We can't find your store location.
              </Typography>
            </motion.div>
            <Typography sx={{ color: 'text.secondary' }}>
              Kindly Scan the Store QR Code and Try it again. Thank you!
            </Typography>

            <motion.div variants={varBounceIn}>
              <Box
                component="img"
                src="/static/illustrations/illustration_login.png"
                sx={{ height: 260, mx: 'auto', my: { xs: 5, sm: 10 } }}
              />
            </motion.div>
          </Box>
        </MotionContainer>
      </Container>
    </RootStyle>
  )
}
