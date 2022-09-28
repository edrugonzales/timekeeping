import { useEffect, useState } from 'react'
import { useSnackbar } from 'notistack5'
// material
import { Link as RouterLink } from 'react-router-dom'
import { Box, Grid, Container, Typography, CardHeader, Card } from '@material-ui/core'
import QRCode from 'react-qr-code'
// components
import Page from '../components/Page'
import HeaderBreadcrumbs from 'components/HeaderBreadcrumbs'

import storage from 'utils/storage'
import user_api from 'utils/api/users'
import Bugsnag from '@bugsnag/js'
// ----------------------------------------------------------------------

export default function StoreQR() {
  const [user, setUser] = useState({})
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setLoading] = useState(false)
  const [branches, setBranches] = useState([])

  useEffect(() => {
    const load = async () => {
      const local_user = await storage.getUser()
      if (!local_user) return
      const user = JSON.parse(local_user)
      setUser(user)

      const branch = await user_api.get_user_branch(user._id);
      if (!branch.ok) {
        setLoading(false)
        Bugsnag.notify(branch)
        return enqueueSnackbar('Unable to fetch branches', { variant: 'warning' })
      }
      setLoading(false)
      setBranches(branch.data)
    }

    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <Page title="QR Code | Time-in">
      <Container maxWidth="xl">
        <HeaderBreadcrumbs
          heading="Store Registration"
          links={[{ name: 'Dashboard', href: '/stores/app' }, { name: 'QR Code' }]}
        />
        <Box sx={{ pb: 5 }}>
          <Typography variant="h6">Note: For Employee Registration</Typography>
          This will redirect them to registration page for employees only!
        </Box>

        <Grid container spacing={3} sx={{ px: 3 }}>
          <Card sx={{ pb: 5, pl: 5, pr: 5 }}>
            <CardHeader title={user.company} sx={{ pl: 0, pb: 0 }} />
            <Box sx={{ pl: 0, pt: 0, pb: 2 }}>
              <Typography variant="p" gutterBottom sx={{ pl: 0, pt: 0, pb: 2 }}>
                {user._id}
              </Typography>
            </Box>
            <QRCode value={`${process.env.REACT_APP_CLIENT_URL}/${user._id}/register`} />
            <Box sx={{ pt: 3, textAlign: 'center' }}>
              <a
                component={RouterLink}
                underline="hover"
                rel="noreferrer"
                href={`${process.env.REACT_APP_CLIENT_URL}/${user._id}/register`}
                target="_blank"
              >
                Go to Link
              </a>
            </Box>
          </Card>
        </Grid>
        {!isLoading ?
          <>
            <Box sx={{ mt: 5, pb: 5 }}>
              <Typography variant="h4">Branches QR Code</Typography>
            </Box>

            <Grid container spacing={3} >
              {branches && branches.map((v, k) => {
                return (
                  <Grid item key={`grid-${k}`} sx={{ width: "24%" }}>
                    <Card sx={{ pb: 5, pl: 5, pr: 5 }}>
                      <CardHeader title={v.company} sx={{ pl: 0, pb: 0 }} />
                      <Box sx={{ pl: 0, pt: 0, pb: 2 }}>
                        <Typography variant="p" gutterBottom sx={{ pl: 0, pt: 0, pb: 2 }}>
                          {v._id}
                        </Typography>
                      </Box>
                      <QRCode value={`${process.env.REACT_APP_CLIENT_URL}/${v._id}/register`} />
                      <Box sx={{ pt: 3, textAlign: 'center' }}>
                        <a
                          component={RouterLink}
                          underline="hover"
                          rel="noreferrer"
                          href={`${process.env.REACT_APP_CLIENT_URL}/${v._id}/register`}
                          target="_blank"
                        >
                          Go to Branch Link
                        </a>
                      </Box>
                    </Card>
                  </Grid>
                )
              })}

            </Grid>
          </> : ""}
      </Container>
    </Page >
  )
}
