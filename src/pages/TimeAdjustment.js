import { filter } from 'lodash'
import { useEffect, useState } from 'react'
// import { Icon } from '@iconify/react';
// import plusFill from '@iconify/icons-eva/plus-fill';
// import { Link as RouterLink } from 'react-router-dom';
// material
import {
  Card,
  Table,
  Stack,
  Avatar,
  // Button,
  Checkbox,
  TableRow,
  TableBody,
  TableHead,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Button,
  IconButton,
  Modal,
  Fade,
  Box,
  Grid,
  Paper
} from '@material-ui/core'
import CloseIcon from '@mui/icons-material/Close';
import AppBar from "@mui/material/AppBar";
// components
import Page from '../components/Page'
import Label from '../components/Label'
import Scrollbar from '../components/Scrollbar'
import SearchNotFound from '../components/SearchNotFound'
import { UserListHead, UserListToolbar, UserMoreMenuArchive } from '../components/_dashboard/user'

import userAPI from 'utils/api/users'
import storage from 'utils/storage'
import Bugsnag from '@bugsnag/js'

const moment = require('moment-timezone')
moment().tz('Asia/Manila').format()
const current_date = `${moment().tz('Asia/Manila').toISOString(true)}`
const TABLE_HEAD = [
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'email', label: 'Email address', alignRight: false },
  { id: 'company', label: 'Company', alignRight: false },
  { id: 'phone', label: 'Phone', alignRight: false },
  { id: 'role', label: 'Role', alignRight: false },
  { id: 'isVerified', label: 'Verified', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
  { id: '' },
]

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
    return filter(array, (_user) => (_user.displayName ? _user.displayName.toLowerCase().indexOf(query.toLowerCase()) !== -1 : ''))
  }
  return stabilizedThis.map((el) => el[0])
}

export default function TimeAdjustment() {
  const [page, setPage] = useState(0)
  const [order, setOrder] = useState('asc')
  const [selected, setSelected] = useState([])
  const [orderBy, setOrderBy] = useState('name')
  const [filterName, setFilterName] = useState('')
  const [recordId, setRecordId] = useState('')
  const [password, setPassword] = useState('')
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [users, setUsers] = useState([])
  const [user, setUser] = useState()
  const [doneAction, setDoneAction] = useState('')
  const [passwordDialog, setPasswordDialog] = useState(true)
  const [isValidated, setIsValidated] = useState(false)

  useEffect(() => {
    const load = async () => {
      const local_user = await storage.getUser()
      if (!local_user) return
      const user = JSON.parse(local_user)
      setUser(user)
      const result = await userAPI.get_limited_usersV2()
      if (!result.ok) {
        Bugsnag.notify(result)
        return
      }
      setUsers(result.data)   
    }

    load()
  }, [])

  useEffect(() => {
    const load = async () => {
      const local_user = await storage.getUser()
      if (!local_user) return
      const user = JSON.parse(local_user)
      setUser(user)
      const result = await userAPI.get_limited_usersV2()
      if (!result.ok) {
        Bugsnag.notify(result)
        return
      }
      setUsers(result.data)   
    }

    load()
  }, [doneAction])

  const handleClosePasswordDialog = () => {
    setPasswordDialog(false)
  }

  const handleGeneratePassword = async () => {
    const result = await userAPI.create_new_password()
    alert("New Password:" + result.data.password)
  }

  const handleValidatePassword = async () => {
    if (password === null || password === "") {
      alert("Please input password")
    }
    else {
      const result = await userAPI.validate_password(password)
      if (result.status === 200) {
        setIsValidated(true)
      }
      else {
        alert(result.data.msg)
        setIsValidated(false) 
      }
    }
    
    
  }

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

  const handleSearch = async (e) => {
    setRecordId(e.target.value)
    if (e.target.value.length === 24) {
      const result = await userAPI.get_record_by_id(e.target.value)
      if (result.status === 200) {
        setUsers(result.data) 
      }
    }
    else {
      setUsers([])
    } 
    
    if (e.target.value === "" || e.target.value === null) {
      const result = await userAPI.get_limited_usersV2()
      if (!result.ok) {
        Bugsnag.notify(result)
        return
      }
      setUsers(result.data)   
    }
    
  }
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - users.length) : 0

  const filteredUsers = applySortFilter(users, getComparator(order, orderBy), filterName)

  const isUserNotFound = filteredUsers.length === 0

  const checkIfDone = (action) => {
    setDoneAction(action)
  }

  return (
    <>
      {!isValidated 
        ?
          <Dialog open={passwordDialog}>
            <AppBar sx={{ position: "relative" }}>
              <DialogTitle id="alert-dialog-title">
                Time Adjustment!
                <IconButton
                  aria-label="close"
                  onClick={handleClosePasswordDialog}
                  sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: (theme) => theme.palette.grey[500],
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </DialogTitle>
            </AppBar>
            <DialogContent>
              Enter Password to use this feature!
              <br />
              <br />
              <TextField id="standard-basic" label="Enter Password" variant="standard" value={password} onChange={(e)=>setPassword(e.target.value)} required/>
              <Button sx={{ml: 3, mt: 1}} variant="contained" onClick={handleValidatePassword}>Submit</Button>
              <br />
              {user && user.email == "a.domacena@sparkles.com.ph" 
                ? 
                  <Button sx={{mt: 5, width: "100%"}} variant="contained" onClick={handleGeneratePassword}>Generate New Password</Button>
                :
                  ""
              }
              
            </DialogContent>
          </Dialog> 
        :
          <Page title="User Archive | Time In">
            <Container>
              <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                <Typography variant="h4" gutterBottom>
                  Time Adjustment
                </Typography>
              </Stack>

              <Card>
                
                <Scrollbar>
                <TextField sx={{m: 3}} id="outlined-basic" value={recordId} onChange={(e) => handleSearch(e)} label="Search by ID" variant="outlined"/>
                  <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 1000 }} aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell>Proccess ID</TableCell>
                          <TableCell align="right">Date</TableCell>
                          <TableCell align="right">Time-in</TableCell>
                          <TableCell align="right">Break-in</TableCell>
                          <TableCell align="right">Break-out</TableCell>
                          <TableCell align="right">Time-out</TableCell>
                          <TableCell align="right">Action</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {users.length > 0 
                          ?
                            <>
                              {users.map((row) => (
                                <TableRow
                                  key={row._id}
                                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                  <TableCell component="th" scope="row">
                                    {row._id}
                                  </TableCell>
                                  <TableCell align="right">{moment(row.date).format('MMMM-DD-YYYY')}</TableCell>
                                  <TableCell align="right">{filterByStatus(row.record, 'time-in').time + " - " + filterByStatus(row.record, 'time-in').workmate}</TableCell>
                                  <TableCell align="right">{filterByStatus(row.record, 'break-in').time + " - " + filterByStatus(row.record, 'break-in').workmate}</TableCell>
                                  <TableCell align="right">{filterByStatus(row.record, 'break-out').time + " - " + filterByStatus(row.record, 'break-out').workmate}</TableCell>
                                  <TableCell align="right">{filterByStatus(row.record, 'time-out').time + " - " + filterByStatus(row.record, 'time-out').workmate}</TableCell>
                                  <TableCell align="right"><UserMoreMenuArchive id={row._id} action={checkIfDone} data={row} /></TableCell>
                                </TableRow>
                              ))}
                            </>
                          :
                            ''
                        }       
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Scrollbar>
              </Card>
            </Container>
          </Page>
      }  
    </>
  )
}