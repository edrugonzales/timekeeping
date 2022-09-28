import {filter} from 'lodash'
import {useEffect, useState} from 'react'
import {
  Card,
  Table,
  Stack,
  Avatar,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
} from '@material-ui/core'
import Page from '../components/Page'
import Label from '../components/Label'
import Scrollbar from '../components/Scrollbar'
import SearchNotFound from '../components/SearchNotFound'
import {UserListHead, UserListToolbar, UserMoreMenu} from '../components/_dashboard/store'

import userAPI from 'utils/api/users'
import socket from 'utils/socket'

const TABLE_HEAD = [
  {id: 'name', label: 'Name', alignRight: false},
  {id: 'email', label: 'Email address', alignRight: false},
  {id: 'company', label: 'Company', alignRight: false},
  {id: 'phone', label: 'Phone', alignRight: false},
  {id: 'role', label: 'Role', alignRight: false},
  {id: 'isVerified', label: 'Verified', alignRight: false},
  {id: 'status', label: 'Status', alignRight: false},
  {id: ''},
]

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1
  }
  if (b[orderBy] > a[orderBy]) {
    return 1
  }
  return 0
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy)
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index])
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0])
    if (order !== 0) return order
    return a[1] - b[1]
  })

  if (query) {
    return filter(array, (_user) => _user.email.toLowerCase().indexOf(query.toLowerCase()) !== -1)
  }
  return stabilizedThis.map((el) => el[0])
}

export default function User() {
  const [page, setPage] = useState(0)
  const [order, setOrder] = useState('asc')
  const [selected, setSelected] = useState([])
  const [orderBy, setOrderBy] = useState('name')
  const [filterName, setFilterName] = useState('')
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [users, setUsers] = useState([])

  useEffect(() => {
    const load = async () => {
      const result = await userAPI.get_users(1)
      if (!result.ok) return
      setUsers(result.data)
    }
    const test = socket.employee_connect()
    console.log(test)
    // const test = socket.employee_disconnect();
    load()
  }, [])

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = users.map((n) => n.name)
      setSelected(newSelecteds)
      return
    }
    setSelected([])
  }

  // const handleClick = (event, name) => {
  //     const selectedIndex = selected.indexOf(name);
  //     let newSelected = [];
  //     if (selectedIndex === -1) {
  //         newSelected = newSelected.concat(selected, name);
  //     } else if (selectedIndex === 0) {
  //         newSelected = newSelected.concat(selected.slice(1));
  //     } else if (selectedIndex === selected.length - 1) {
  //         newSelected = newSelected.concat(selected.slice(0, -1));
  //     } else if (selectedIndex > 0) {
  //         newSelected = newSelected.concat(
  //             selected.slice(0, selectedIndex),
  //             selected.slice(selectedIndex + 1)
  //         );
  //     }
  //     setSelected(newSelected);
  // };

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleFilterByName = (event) => {
    setFilterName(event.target.value)
  }

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - users.length) : 0

  const filteredUsers = applySortFilter(users, getComparator(order, orderBy), filterName)

  const isUserNotFound = filteredUsers.length === 0

  return (
    <Page title="Store | Time In">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Store
          </Typography>
        </Stack>

        <Card>
          <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

          <Scrollbar>
            <TableContainer sx={{minWidth: 800}}>
              {users ? (
                <Table>
                  <UserListHead
                    order={order}
                    orderBy={orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={users.length}
                    numSelected={selected.length}
                    onRequestSort={handleRequestSort}
                    onSelectAllClick={handleSelectAllClick}
                  />
                  <TableBody>
                    {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                      const {
                        _id,
                        firstName,
                        displayName,
                        lastName,
                        email,
                        phone,
                        role,
                        isOnBoarded,
                        company,
                        image,
                        isVerified,
                      } = row
                      let name = `${firstName} ${lastName}`
                      if (firstName === null || lastName === null) {
                        name = displayName
                      }
                      const isItemSelected = selected.indexOf(name) !== -1
                      return (
                        <TableRow
                          hover
                          key={_id}
                          tabIndex={-1}
                          role="checkbox"
                          selected={isItemSelected}
                          aria-checked={isItemSelected}
                        >
                          <TableCell padding="checkbox"></TableCell>
                          <TableCell component="th" scope="row" padding="none">
                            <Stack direction="row" alignItems="center" spacing={2}>
                              <Avatar alt={name} src={image} />
                              <Typography variant="subtitle2" noWrap>
                                {name}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell align="left">{email}</TableCell>
                          <TableCell align="left">{company}</TableCell>
                          <TableCell align="left">{phone}</TableCell>
                          <TableCell align="left">
                            <Label variant="ghost" color={'info'}>
                              {role === 1 ? 'Store' : 'Employee'}
                            </Label>
                          </TableCell>
                          <TableCell align="left">
                            <Label variant="ghost">{isVerified ? 'Yes' : 'No'}</Label>
                          </TableCell>
                          <TableCell align="left">
                            <Label variant="ghost" color={!isOnBoarded ? 'error' : 'success'}>
                              {isOnBoarded ? 'Complete' : 'Incomplete'}
                            </Label>
                          </TableCell>

                          <TableCell align="right">
                            <UserMoreMenu user={row} />
                          </TableCell>
                        </TableRow>
                      )
                    })}
                    {emptyRows > 0 && (
                      <TableRow style={{height: 53 * emptyRows}}>
                        <TableCell colSpan={6} />
                      </TableRow>
                    )}
                  </TableBody>
                  {isUserNotFound && (
                    <TableBody>
                      <TableRow>
                        <TableCell align="center" colSpan={8} sx={{py: 3}}>
                          <SearchNotFound searchQuery={filterName} />
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  )}
                </Table>
              ) : (
                ''
              )}
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={users.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    </Page>
  )
}
