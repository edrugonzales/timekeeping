import { filter } from 'lodash'
import { useEffect, useState } from 'react'
// material
import {
  Card,
  Table,
  Stack,
  Avatar,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  Modal,
  Backdrop,
  Fade,
  Box,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  TextField

} from '@material-ui/core'
// components
import Page from '../components/Page'
import Label from '../components/Label'
import Scrollbar from '../components/Scrollbar'
import SearchNotFound from '../components/SearchNotFound'
import { UserListHead, UserListToolbar } from '../components/_dashboard/user'
import AdminMoreMenu from '../components/_dashboard/user/AdminMoreMenu'
import userAPI from 'utils/api/users'
import storage from 'utils/storage'
import Bugsnag from '@bugsnag/js'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
const moment = require('moment-timezone')
moment().tz('Asia/Manila').format()
const current_date = `${moment().tz('Asia/Manila').toISOString(true)}`
const TABLE_HEAD = [
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'date', label: 'Date', alignRight: false },
  { id: 'time-in', label: 'time-in', alignRight: false },
  { id: 'break-in', label: 'break-in', alignRight: false },
  { id: 'break-out', label: 'break-out', alignRight: false },
  { id: 'time-out', label: 'time-out', alignRight: false },
  { id: 'action', label: 'action', alignRight: false },
]

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

// ----------------------------------------------------------------------

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
    return filter(array, (_user) => (_user.Employee.displayName ? _user.Employee.displayName.toLowerCase().indexOf(query.toLowerCase()) !== -1 : ''))
  }
  return stabilizedThis.map((el) => el[0])
}

export default function User() {
  const [page, setPage] = useState(0)
  const [order, setOrder] = useState('asc')
  const [selected, setSelected] = useState([])
  const [company, setCompany] = useState([])
  const [selectedCompany, setSelectedCompany] = useState("Star Concorde Group")
  const [orderBy, setOrderBy] = useState('name')
  const [filterName, setFilterName] = useState('')
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [users, setUsers] = useState([])
  const [open, setOpen] = useState(false)
  const [id, setId] = useState()
  const [name, setName] = useState()
  const d = new Date();
  const [date, setDate] = useState(d.setDate(d.getDate() - 1))
  const [doneAction, setDoneAction] = useState('')

  useEffect(() => {
    const load = async () => {
      const local_user = await storage.getUser()
      if (!local_user) return

      const user = JSON.parse(local_user)
      const fomattedDate = moment(date).format('YYYY-MM-DD')
      const result = await userAPI.get_record_bystore(selectedCompany, fomattedDate)
      const getCompany = await userAPI.get_user_company()
      if (!result.ok) {
        Bugsnag.notify(result)
        return
      }
      setUsers(result.data)
      setCompany(getCompany.data)
    }

    load()
  }, [doneAction])

/*  useEffect(() => {
    const load = async () => {
      const local_user = await storage.getUser()
      if (!local_user) return

      const user = JSON.parse(local_user)
      const result = await userAPI.get_record_bystore("Star Concorde Group", date)
      const getCompany = await userAPI.get_user_company()
      if (!result.ok) {
        Bugsnag.notify(result)
        return
      }
      setUsers(result.data)
      setCompany(getCompany.data)
    }

    load()
  }, [filterName])*/

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

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name)
    let newSelected = []
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1))
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1))
    }
    setSelected(newSelected)
  }

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

  const handleClose = () => setOpen(false);

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - users.length) : 0

  const filteredUsers = applySortFilter(users, getComparator(order, orderBy), filterName)

  const isUserNotFound = filteredUsers.length === 0

  const renderTime = (_time) => {
    let _date = new Date(_time)
    var hours = _date.getHours()
    var minutes = _date.getMinutes()
    var ampm = hours >= 12 ? 'pm' : 'am'
    hours = hours % 12
    hours = hours ? hours : 12 // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes
    var strTime = hours + ':' + minutes + ' ' + ampm
    return strTime
  }

  const filterByStatus = (_data, type) => {
    let _d = _data.filter((_d) => (_d.status === type ? _d : ''))
    if (_d.length > 0) {
      _d = _d[0]
    }
    if (_d) {
      if(typeof(_d.time) === "string") {
        return {
          time: _d.time === undefined ? 'n/a' : _d.time,
          location: _d.address === undefined ? 'n/a' : _d.address,
          workmate: _d.workmate === undefined ? '' : 'Workmate( ' +_d.workmate + ' )'
        }
      }
      else {
        return {
          time: _d.time === undefined ? 'n/a' : renderTime(_d.time),
          location: _d.address === undefined ? 'n/a' : _d.address,
          workmate: _d.workmate === undefined ? '' : 'Workmate( ' +_d.workmate + ' )'
        }   
      }   
    } else {
      return '-'
    }
  }

  const checkIfDone = (action) => {
    setDoneAction(action)
  }

  const handleChangeDate = async (date) => {
    const fomattedDate = moment(date).format('YYYY-MM-DD')
    setDate(date)
    const result = await userAPI.get_record_bystore(selectedCompany, fomattedDate)
    setUsers(result.data)
  }

  const handleStoreChange = async (e) => {
    const fomattedDate = moment(date).format('YYYY-MM-DD')
    setSelectedCompany(e.target.value)
    const result = await userAPI.get_record_bystore(e.target.value, fomattedDate)
    setUsers(result.data)
  }

  return (
    <Page title="User | Time In">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            User
          </Typography>
          {/* <Button
            variant="contained"
            component={RouterLink}
            to="#"
            startIcon={<Icon icon={plusFill} />}
          >
            New User
          </Button> */}
        </Stack>

        <Card>
          <FormControl sx={{ mt: 4, ml: 3, minWidth: 300 }}>
            <InputLabel id="demo-simple-select-helper-label">Store</InputLabel>
            <Select
              labelId="demo-simple-select-helper-label"
              id="demo-simple-select-helper"
              value={selectedCompany}
              label="Star Concorde Group"
              onChange={handleStoreChange}
            >
              {
                company.map(item => {
                  return (
                    <MenuItem value={item}>{item}</MenuItem>
               
                  )
                })
              }
            </Select>
          </FormControl>
          <FormControl sx={{ mt: 4, ml: 3, minWidth: 300 }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DesktopDatePicker
                label="Choose Date"
                value={date}
                minDate={new Date('2017-01-01')}
                renderInput={(params) => <TextField {...params} />}
                onChange={(date:Date) => handleChangeDate(date)}
              />
            </LocalizationProvider>
          </FormControl>
          <FormControl sx={{mt: 1, pt: 0.5}}>
            <UserListToolbar  numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />
          </FormControl>
          

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
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
                      const isItemSelected = selected.indexOf(name) !== -1
                      return (
                        <TableRow
                          hover
                          key={row.Employee._id}
                          tabIndex={-1}
                          role="checkbox"
                          selected={isItemSelected}
                          aria-checked={isItemSelected}
                        >
                          <TableCell component="th" scope="row" padding="none">
                            <Stack direction="row" alignItems="center" spacing={2}>
                              <Typography variant="subtitle2" sx={{ml: 3}}>
                                {row.Employee.displayName}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell align="left">{moment(date).format('MMMM-DD-YYYY')}</TableCell>
                          {row.Records.length > 0
                            ?
                              <> 
                                <TableCell align="left">{filterByStatus(row.Records[0].record, 'time-in').time + " - " + filterByStatus(row.Records[0].record, 'time-in').workmate}</TableCell>
                                <TableCell align="left">{filterByStatus(row.Records[0].record, 'break-in').time + " - " + filterByStatus(row.Records[0].record, 'break-in').workmate}</TableCell>
                                <TableCell align="left">{filterByStatus(row.Records[0].record, 'break-out').time + " - " + filterByStatus(row.Records[0].record, 'break-out').workmate}</TableCell>
                                <TableCell align="left">{filterByStatus(row.Records[0].record, 'time-out').time + " - " + filterByStatus(row.Records[0].record, 'time-out').workmate}</TableCell>
                                <TableCell align="left"><AdminMoreMenu id={row.Records[0]._id} user={row.Employee._id} action={checkIfDone} data={row} /></TableCell>  
                              </>
                            :
                              <> 
                                <TableCell align="left"> - </TableCell>
                                <TableCell align="left"> - </TableCell>
                                <TableCell align="left"> - </TableCell>
                                <TableCell align="left"> - </TableCell>
                                <TableCell align="left"><AdminMoreMenu id={row.Records._id} user={row.Employee._id} action={checkIfDone} data={row} /></TableCell>   
                              </> 
                          }
                          
                        </TableRow>
                      )
                    })}
                    {emptyRows > 0 && (
                      <TableRow style={{ height: 53 * emptyRows }}>
                        <TableCell colSpan={6} />
                      </TableRow>
                    )}
                  </TableBody>
                  {isUserNotFound && (
                    <TableBody>
                      <TableRow>
                        <TableCell align="center" colSpan={8} sx={{ py: 3 }}>
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
