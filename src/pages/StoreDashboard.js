import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import jwt_decode from 'jwt-decode'
// material
import { Grid, Container } from '@material-ui/core'
// components
import Page from '../components/Page'
import { AppNewUsers, AppBugReports, AppItemOrders, AppNewsUpdate, AppWeeklySales } from '../components/_dashboard/app'
import { AppWelcome, AppFeatured } from 'components/dashboard'

//hooks / api
import storage from 'utils/storage'
import user_api from 'utils/api/users'
import Bugsnag from '@bugsnag/js'
// ----------------------------------------------------------------------

export default function DashboardApp() {
  const navigate = useNavigate();
  const [user, setUser] = useState([]);
  const [location, setLocation] = useState({
    latitude: 0,
    longitude: 0,
  })
  useEffect(() => {
    const load = async () => {
      const token = await storage.getToken();
      const current_date = new Date();

      if (!token || jwt_decode(token)['exp'] * 1000 < current_date.getTime()) {
        await storage.remove()
        return navigate('/login')
      }

      const result = await user_api.get_user(jwt_decode(token)['id']);
      if (!result.ok) {
        Bugsnag.notify(result)
        return;
      }
      navigator.geolocation.watchPosition(function (position) {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          })
      })
      setUser(result.data);
    }

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Page title="Dashboard | Time-in">
      <Container maxWidth="xl">
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <AppWelcome user={user} />
          </Grid>

          {/*<Grid item xs={12} md={12}>
            <AppFeatured />
          </Grid>*/}


          <Grid item xs={12} sm={12} md={6} lg={6}>
            {location.latitude === 0
              ?
                <h3 style={{"text-align":"center"}}>Getting current location</h3> 
              :
                <>
                  <iframe 
                      title="resumeIframe"
                      src={`https://maps.google.de/maps?hl=en&q=${location.latitude},${location.longitude}&ie=UTF8&t=&z=17&iwloc=B&output=embed`}                            
                      width="100%" 
                      height="450" 
                      frameBorder="0"
                      scrolling="no"
                      marginHeight="0"
                      marginWidth="0"
                      allowfullscreen=""
                      key={`landmark-${location.latitude}`} 
                      >
                  </iframe>
                  <h3 style={{"text-align": 'center'}}>Current Location</h3>
                </>
            }
              
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6}>
            <AppNewsUpdate />
          </Grid>
        </Grid>
      </Container>
    </Page>
  )
}
