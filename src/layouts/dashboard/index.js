import { useEffect, useState, useContext } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
// material
import jwt_decode from 'jwt-decode'
import { styled } from '@material-ui/core/styles'
//
import DashboardNavbar from './DashboardNavbar'
import DashboardSidebar from './DashboardSidebar'
import storage from 'utils/storage'
import user_api from 'utils/api/users'

import { SocketContext } from 'utils/context/socket'
import { MainContext } from 'utils/context/main'
// import {UsersContext} from 'utils/context/users'

// ----------------------------------------------------------------------

const APP_BAR_MOBILE = 64
const APP_BAR_DESKTOP = 92

const RootStyle = styled('div')({
  display: 'flex',
  minHeight: '100%',
  overflow: 'hidden',
})

const MainStyle = styled('div')(({ theme }) => ({
  flexGrow: 1,
  overflow: 'auto',
  minHeight: '100%',
  paddingTop: APP_BAR_MOBILE + 24,
  paddingBottom: theme.spacing(10),
  [theme.breakpoints.up('lg')]: {
    paddingTop: APP_BAR_DESKTOP + 24,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
}))

// ----------------------------------------------------------------------

export default function DashboardLayout() {
  const socket = useContext(SocketContext)
  const navigation = useNavigate()
  const { setName, setRoom } = useContext(MainContext)
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const [data, setData] = useState({
    users: [],
    online: 0,
    employees: [],
  })

  useEffect(() => {
    const load = async () => {
      const local_user = await storage.getUser()

      if (!local_user) return navigate('/login')
      const user = JSON.parse(local_user)
      let name,
        _id,
        uuid = undefined

      if (user.role === 1 || user.role === 4) {
        name = user.displayName
        uuid = _id = user._id
        socket.emit('connected', { name, uuid, _id }, (error) => {
          if (error) {
            console.log(error)
          }
        })
      } else {
        name = user.displayName
        _id = user.sid
        uuid = user._id
      }

      if (!name || !uuid || !_id) return
      setName(name)
      setRoom(uuid)
      socket.emit('connected', { name, uuid, _id }, (error) => {
        if (error) {
          console.log(error)
        }
      })
      return setData((p) => ({ ...p, users: user }))
    }

    const check_login = async () => {
      const token = await storage.getToken()
      const current_date = new Date()

      if (!token) {
        await storage.remove()
        return
      }

      if (jwt_decode(token)['exp'] * 1000 < current_date.getTime()) {
        await storage.remove()
        return navigation('/login')
      }

      const result = await user_api.get_user(jwt_decode(token)['id'])
      if (!result.ok) {
        await storage.remove()
        return navigation('/login')
      }

      if (result.data.isArchived) return alert('Your account is disabled')
      if ((result.data.role === 1 || result.data.role === 4) && !result.data.isOnBoarded) return navigation('/store/onboard')
      if (result.data.role === 0 && !result.data.isOnBoarded) return navigation(`${result.data.store_id}/onboard`)

      if (result.data.role === 1 || result.data.role === 4) return navigation('/stores')

    }

    check_login()
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <RootStyle>
        <DashboardNavbar onOpenSidebar={() => setOpen(true)} _data={data} />
        {data.users.role && (JSON.parse(data.users.role) === 1 || JSON.parse(data.users.role) === 4) ? (
          <DashboardSidebar isOpenSidebar={open} account={data.users} onCloseSidebar={() => setOpen(false)} />
        ) : (
          ''
        )}
        <MainStyle>
          {/* <Detector
            render={({online}) =>
              !online ? (
                <>
                  <Box
                    component="img"
                    src="/static/illustrations/offline.gif"
                    sx={{height: 300, mx: 'auto', my: {xs: 0, sm: 0}}}
                  />
                  <Typography variant="h4" sx={{textAlign: 'center'}}>
                    No Internet Connection
                  </Typography>
                </>
              ) : (
                <Outlet />
              )
            }
          /> */}
          <Outlet />
        </MainStyle>
      </RootStyle>
    </>
  )
}
