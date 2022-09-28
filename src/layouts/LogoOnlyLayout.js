import { useEffect } from 'react'
import { Link as RouterLink, Outlet, useNavigate, useParams, useLocation } from 'react-router-dom'
import jwt_decode from 'jwt-decode'
// material
import { styled } from '@material-ui/core/styles'

// components
import Logo from 'components/Logo'
import storage from 'utils/storage'
import user_api from 'utils/api/users'
import HelpButton from 'components/discord';
import Bugsnag from '@bugsnag/js'
// ----------------------------------------------------------------------

const HeaderStyle = styled('header')(({ theme }) => ({
  top: 0,
  left: 0,
  lineHeight: 0,
  width: '100%',
  position: 'absolute',
  padding: theme.spacing(3, 3, 0),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(5, 5, 0),
  },
}))

// ----------------------------------------------------------------------

export default function LogoOnlyLayout() {
  const navigation = useNavigate()
  const params = useParams();
  const location = useLocation();

  const check_login = async () => {
    const token = await storage.getToken();
    const current_date = new Date()

    if (params.store && location.pathname.includes("/register")) {
      return;
    }

    if (!token) {
      return await storage.remove()
    }

    if (jwt_decode(token)['exp'] * 1000 < current_date.getTime()) {
      await storage.remove()
      return navigation('/login')
    }

    const result = await user_api.get_user(jwt_decode(token)['id'])
    if (!result.ok) {
      Bugsnag.notify(result)
      await storage.remove()
      return navigation('/login')
    }

    if (result.data.isArchived) return alert('Your account is disabled')
    if ((result.data.role === 1 || result.data.role === 4) && !result.data.isOnBoarded) return navigation('/store/onboard')
    if (result.data.role === 0 && !result.data.isOnBoarded) return navigation(`${result.data.store_id}/onboard`)

    if (result.data.role === 1 || result.data.role === 4) return navigation('/stores')
    return navigation('/dashboard')
  }

  useEffect(() => {
    check_login()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <HeaderStyle>
        <RouterLink to="/">
          <Logo />
        </RouterLink>
      </HeaderStyle>
      <Outlet />
      <HelpButton />

    </>
  )
}
