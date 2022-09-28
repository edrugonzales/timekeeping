import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
// routes
import AppRoute from './routes'
// theme
import ThemeConfig from './theme'
// components
// import Settings from './components/settings';
import RtlLayout from './components/RtlLayout'
import ScrollToTop from './components/ScrollToTop'
import NotistackProvider from './components/NotistackProvider'
import ThemePrimaryColor from './components/ThemePrimaryColor'
import ThemeLocalization from './components/ThemeLocalization'
import { MainProvider } from './utils/context/main'
import { UsersProvider } from './utils/context/users'
import { SocketProvider } from './utils/context/socket'
// ----------------------------------------------------------------------

import settings_api from './utils/api/settings';
import storage from './utils/storage';

export default function App() {
  const navigate = useNavigate();
 /* const force_relogin = async () => {
    try {
      const result = await settings_api.force_relog();
      if (!result.ok) return

      if (result.data[0].value === true) {
        await storage.remove();
        navigate('/login')
      }
    } catch (err) {
    }
  }

  const load = async () => {
    await force_relogin()
  }

  useEffect(() => {

    const interval = setInterval(() => {
      // load();
    }, 10000) //10000 10seconds

    return () => {
      clearInterval(interval)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])*/


  return (
    <ThemeConfig>
      <ThemePrimaryColor>
        <ThemeLocalization>
          <MainProvider>
            <UsersProvider>
              <SocketProvider>
                <RtlLayout>
                  <NotistackProvider>
                    <ScrollToTop />
                    <AppRoute />
                  </NotistackProvider>
                </RtlLayout>
              </SocketProvider>
            </UsersProvider>
          </MainProvider>
        </ThemeLocalization>
      </ThemePrimaryColor>
    </ThemeConfig>
  )
}
