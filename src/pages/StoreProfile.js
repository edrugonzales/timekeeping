import { useEffect, useState } from 'react'
// material
import { Icon } from '@iconify/react';
import { capitalCase } from 'change-case';
import { useNavigate } from 'react-router-dom'
import roundVpnKey from '@iconify/icons-ic/round-vpn-key';
import roundAccountBox from '@iconify/icons-ic/round-account-box';
import { Container, Tab, Box, Tabs, Stack } from '@material-ui/core';

import jwt_decode from 'jwt-decode'
// components
import Page from '../components/Page'
import HeaderBreadcrumbs from 'components/HeaderBreadcrumbs'
import {
    AccountGeneral,
    AccountChangePassword
} from 'components/account';

//hooks / api
import storage from 'utils/storage'
import user_api from 'utils/api/users'
import Bugsnag from '@bugsnag/js'
// ----------------------------------------------------------------------

export default function StoreProfile() {
    const navigation = useNavigate();
    const [user, setUser] = useState({})
    const [currentTab, setCurrentTab] = useState('general');

    useEffect(() => {
        const load = async () => {
            const token = await storage.getToken();
            const current_date = new Date()
            if (!token) {
                return;
            }

            if (jwt_decode(token)['exp'] * 1000 < current_date.getTime()) {
                await storage.remove()
                return navigation('/login')
            }

            const result = await user_api.get_user(jwt_decode(token)['id'])

            if (!result.ok) {
                Bugsnag.notify(result)
                return;
            }
            return setUser(result.data);

        }

        load()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const ACCOUNT_TABS = [
        {
            value: 'general',
            icon: <Icon icon={roundAccountBox} width={20} height={20} />,
            component: <AccountGeneral _data={user} />
        },
        {
            value: 'change_password',
            icon: <Icon icon={roundVpnKey} width={20} height={20} />,
            component: <AccountChangePassword />
        }
    ];

    const handleChangeTab = (event, newValue) => {
        setCurrentTab(newValue);
    };

    return (
        <Page title="Profile | Time-in">
            <Container maxWidth="xl">
                <HeaderBreadcrumbs
                    heading="Store Profile"
                    links={[{ name: 'Dashboard', href: '/stores/profile' }, { name: 'Profile' }]}
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
                        const isMatched = tab.value === currentTab;
                        return isMatched && <Box key={tab.value}>{tab.component}</Box>;
                    })}
                </Stack>
            </Container>
        </Page>
    )
}
