import React, { useState, useEffect, useContext } from 'react'
import PropTypes from 'prop-types'
import { Icon } from '@iconify/react'
import { useSnackbar } from 'notistack5'
import menu2Fill from '@iconify/icons-eva/menu-2-fill'
import { alpha, styled } from '@material-ui/core/styles'
import { Box, Stack, AppBar, Toolbar, IconButton } from '@material-ui/core'
import { MHidden } from '../../components/@material-extend'
//
import AccountPopover from './AccountPopover'
// import NotificationsPopover from './NotificationsPopover'
import storage from 'utils/storage'
import { SocketContext } from 'utils/context/socket'
// import {UsersContext} from 'utils/context/users'
const DRAWER_WIDTH = 280
const APPBAR_MOBILE = 64
const APPBAR_DESKTOP = 92

const RootStyle = styled(AppBar)(({ theme }) => ({
  boxShadow: 'none',
  backdropFilter: 'blur(6px)',
  WebkitBackdropFilter: 'blur(6px)', // Fix on Mobile
  backgroundColor: alpha(theme.palette.background.default, 0.72),
  [theme.breakpoints.up('lg')]: {
    width: `calc(100% - ${DRAWER_WIDTH + 1}px)`,
  },
}))

const ToolbarStyle = styled(Toolbar)(({ theme }) => ({
  minHeight: APPBAR_MOBILE,
  [theme.breakpoints.up('lg')]: {
    minHeight: APPBAR_DESKTOP,
    padding: theme.spacing(0, 5),
  },
}))

const DashboardNavbar = ({ onOpenSidebar, _data }) => {
  const socket = useContext(SocketContext)
  const { enqueueSnackbar } = useSnackbar()
  // const {users, setUsers} = useContext(UsersContext)
  const [data, setData] = useState({
    users: [],
    employee: [],
    loading: false,
    online: 0,
  })
  const load = async () => {
    setData((p) => ({ ...p, loading: true }))
    const local_user = await storage.getUser()
    if (!local_user) return;
    const user = JSON.parse(local_user)
    let { _id, role } = user
    if (role === 1) {
      socket.emit('get_users', { _id })
    }
    return setData((p) => ({ ...p, users: user, loading: false }))
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    socket.on('notification', async (notif) => {
      const local_user = await storage.getUser()
      if (!local_user) return;
      const user = JSON.parse(local_user)
      if (user.role === 1 || user.role === 4) {
        let { _id } = user
        socket.emit('get_users', { _id })
        enqueueSnackbar(notif?.description, {
          variant: 'info',
        })
      }
    })

    socket.on('receive_status', async (notif) => {
      const local_user = await storage.getUser()
      if (!local_user) return;
      const user = JSON.parse(local_user)
      if (user.role === 1 || user.role === 4) {
        let { _id } = user
        socket.emit('get_users', { _id })
        enqueueSnackbar(`${notif?.user} - ${notif?.status}`, {
          variant: 'info',
        })
      }
    })

    socket.on('users', async (users) => {
      if (!users) return console.log('error fetching users')

      const local_user = await storage.getUser()
      if (!local_user) return console.log('error current user')

      const index = users.findIndex((user) => user.uuid === user._id)
      if (index !== -1) {
        return users.splice(index, 1)[0]
      }

      return setData((p) => ({ ...p, online: users.length }))
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, enqueueSnackbar])

  return (
    <RootStyle>
      <ToolbarStyle>
        {data.users.role === 1 || data.users.role === 4 ? (
          <MHidden width="lgUp">
            <IconButton onClick={onOpenSidebar} sx={{ mr: 1, color: 'text.primary' }}>
              <Icon icon={menu2Fill} />
            </IconButton>
          </MHidden>
        ) : (
          ''
        )}
        <Box sx={{ flexGrow: 1 }} />
        <Stack direction="row" alignItems="center" spacing={{ xs: 0.5, sm: 1.5 }}>
          {data.users.role === 1 || data.users.role === 4 ? (
            <>
              <h5 style={{ color: '#727272' }}>
                {data.online} Online {data.online && data.online > 0 ? 'Employees' : 'Employee'}
              </h5>
              {/* <NotificationsPopover /> */}
            </>
          ) : (
            ''
          )}
          <AccountPopover user={data.users} />
        </Stack>
      </ToolbarStyle>
    </RootStyle>
  )
}

export default DashboardNavbar

DashboardNavbar.propTypes = {
  onOpenSidebar: PropTypes.func,
}
