import {Icon} from '@iconify/react'
import {capitalCase} from 'change-case'
import {useState, useEffect} from 'react'
import {useParams} from 'react-router-dom'
import roundReceipt from '@iconify/icons-ic/round-receipt'
import shareFill from '@iconify/icons-eva/share-fill'
import roundVpnKey from '@iconify/icons-ic/round-vpn-key'
import roundAccountBox from '@iconify/icons-ic/round-account-box'
import {Container, Tab, Box, Tabs, Stack} from '@material-ui/core'
import HeaderBreadcrumbs from 'components/HeaderBreadcrumbs'
import Page from '../components/Page'
import {AccountGeneral, AccountReport, AccountQRCode, AccountChangePassword} from 'components/_dashboard/user/account'

import userAPI from 'utils/api/users'
import Bugsnag from '@bugsnag/js'

export default function StoreDetails() {
  const location = useParams()
  const [currentTab, setCurrentTab] = useState('general')
  const [user, setUser] = useState([])

  useEffect(() => {
    const load = async () => {
      const {id} = location
      const result = await userAPI.get_user(id)
      if (!result.ok) {
        Bugsnag.notify(result)
        return
      }
        return setUser(result.data)
    }

    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const ACCOUNT_TABS = [
    {
      value: 'general',
      icon: <Icon icon={roundAccountBox} width={20} height={20} />,
      component: <AccountGeneral _data={user} />,
    },
    {
      value: 'reports',
      icon: <Icon icon={roundReceipt} width={20} height={20} />,
      component: <AccountReport _data={user} />,
    },
    {
      value: 'qr_code',
      icon: <Icon icon={shareFill} width={20} height={20} />,
      component: <AccountQRCode _data={user} />,
    },
    {
      value: 'change_password',
      icon: <Icon icon={roundVpnKey} width={20} height={20} />,
      component: <AccountChangePassword />,
    },
  ]

  const handleChangeTab = (event, newValue) => {
    setCurrentTab(newValue)
  }

  return (
    <Page title="Store Details  | Time In">
      <Container maxWidth={'lg'}>
        <HeaderBreadcrumbs
          heading="Account"
          links={[
            {name: 'Dashboard', href: '/dashboard/app'},
            {name: 'Store List', href: '/dashboard/store'},
            {name: 'Store Details'},
          ]}
        />

        <Stack spacing={5}>
          <Tabs
            value={currentTab}
            scrollButtons="auto"
            variant="scrollable"
            allowScrollButtonsMobile
            onChange={handleChangeTab}
          >
            {ACCOUNT_TABS.map((tab) => (
              <Tab disableRipple key={tab.value} label={capitalCase(tab.value)} icon={tab.icon} value={tab.value} />
            ))}
          </Tabs>

          {ACCOUNT_TABS.map((tab) => {
            const isMatched = tab.value === currentTab
            return isMatched && <Box key={tab.value}>{tab.component}</Box>
          })}
        </Stack>
      </Container>
    </Page>
  )
}
