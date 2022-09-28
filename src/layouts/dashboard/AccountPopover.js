import {Link as RouterLink, useNavigate} from 'react-router-dom'
import React, {useRef, useState, useEffect, useContext} from 'react'
import {Icon} from '@iconify/react'
import homeFill from '@iconify/icons-eva/home-fill'
import personFill from '@iconify/icons-eva/person-fill'
import settings2Fill from '@iconify/icons-eva/settings-2-fill'
import QrReader from 'react-qr-reader'
import {alpha} from '@material-ui/core/styles'
import QRCode from "qrcode.react"
import jwt_decode from 'jwt-decode'
import {
  Button,
  Box,
  Divider,
  MenuItem,
  Typography,
  Avatar,
  IconButton,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Grid,
  Container,
  FormControlLabel,
  Checkbox,
  Modal,
  Backdrop,
  Fade,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  TableContainer,
  AppBar,
} from '@material-ui/core'
import CloseIcon from '@mui/icons-material/Close';
import MenuPopover from '../../components/MenuPopover'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"
import storage from 'utils/storage'

import {Formik, useField} from 'formik'
import * as yup from 'yup'

import discord_api from 'utils/api/discord'
import {useSnackbar} from 'notistack5'
import Bugsnag from '@bugsnag/js'
import useUser from 'utils/api/users'
import Clock from 'react-live-clock'
import {SocketContext} from 'utils/context/socket'
import {BreakOut, BreakIn, TimeIn, TimeOut, Completed, Loading} from 'components/timeButton'
import user_api from 'utils/api/users'
import Page from '../../components/Page'
import '../../_style.css'

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
  customWidth: {
    maxWidth: "none",
    height: "500px"
  }
})

const MENU_OPTIONS = [
  {
    label: 'Home',
    icon: homeFill,
    linkTo: '/',
  },
  {
    label: 'Profile',
    icon: personFill,
    linkTo: '/stores/profile',
  },
  {
    label: 'Settings',
    icon: settings2Fill,
    linkTo: '#',
  },
]

const validationSchema = yup.object({
  company: yup.string().max(40, 'Too long').required(),
})

const CustomTextField = ({type, label, placeholder, InputProps, ...props}) => {
  const [field, meta] = useField(props)
  const errorText = meta.error && meta.touched ? meta.error : ''
  return (
    <TextField
      label={label}
      type={type}
      variant="standard"
      fullWidth
      margin="dense"
      required
      placeholder={placeholder}
      {...field}
      helperText={errorText}
      error={!!errorText}
      InputProps={InputProps}
    />
  )
}
// ----------------------------------------------------------------------
const moment = require('moment-timezone')
moment().tz('Asia/Manila').format()
const current_date = `${moment().tz('Asia/Manila').toISOString(true)}`
export default function AccountPopover({user}) {
  const classes = useStyles()
  let today = new Date(current_date)
  const anchorRef = useRef(null)
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [id, setId] = useState('')
  const [name, setName] = useState('')
  const [openQR, setOpenQR] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)
  const [value, setValue] = useState(null)
  const [validated, setValidated] = useState(false)
  const [openWorkmateTimein, setOpenWorkmateTimein] = useState(false)
  const {enqueueSnackbar} = useSnackbar()
  const [userState, setUser] = useState(user)
  const [currentDate, setCurrentDate] = useState(null)
  const [isLoading, setLoading] = useState(false)
  const [openHistory, setOpenHistory] = useState(false)
  const socket = useContext(SocketContext)
  const [status, setStatus] = useState(null)
  const [qrUser, setQrUser] = useState({})
  const [users, setUsers] = useState([])
  const [startDate, setStartDate] = useState(new Date());
  const [location, setLocation] = useState({
    latitude: 0,
    longitude: 0,
  })
  const load = async () => {
    const token = await storage.getToken()
     if (!token) {
      await storage.remove()
      return navigate('/login')
    }
    const inuser = await user_api.get_user(jwt_decode(token)['id'])
    if (!inuser.ok) {
      Bugsnag.notify(inuser)
      await storage.remove()
      return navigate('/login')
    }
    await storage.storeUser(inuser.data)
    const local_user = await storage.getUser()
    if (!local_user) return enqueueSnackbar('Unable to proceed, Kindly Re-log again', {variant: 'warning'})
    const userState = JSON.parse(local_user)
    setUser(userState)
  }

  useEffect(async () => {
    load()
    await geolocation()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleClickOpenEdit = () => {
    setOpenEdit(true)

  }

  const handleCloseEdit = () => {
    setValidated(false)
    setOpenEdit(false)
  }

  const handleOpen = () => {
    setOpen(true)
  }
  const handleClose = () => {
    setValidated(false)
    setOpen(false)
  }

  const handleSignOut = async (e) => {
    e.preventDefault()
    await storage.remove()
    navigate(`/login`)
  }

  const handleOpenWorkmateTimein = async () => {
    setOpenWorkmateTimein(true)
  }

  const handleCloseWorkmateTimein = () => {
    setValue(null)
    setOpenWorkmateTimein(false)
    setValidated(false)
  }

  const handleScan = async (res) => {
    if (res) {
      setValue(res)
      const result = await user_api.get_user(res)
      setQrUser(result.data)
      handleStatus(res)
    }
  }
  const handleError = (err) => {
    console.error(err)
  }

  const handleStatus = async (_id) => {
    if (!_id) {
      setLoading(false)
      return navigate('/login')
    }

    setLoading(true)
    await geolocation()
    const result = await user_api.get_user_status(_id)

    if (!result.ok) {
      setLoading(false)
      Bugsnag.notify(result)
      setStatus(null)
    }

    if (!result || !result.data) {
      setStatus(null)
      return setLoading(false)
    }

    if (!result.data) return setLoading(false)
    let {status, date} = result.data[0] // get the last data

    let record_date = new Date(date)

    // if (record_date.getDate() === today.getDate() && record_date.getUTCMonth() + 1 === today.getUTCMonth() + 1) {
    setStatus(status)
    setCurrentDate(date)
    // } else {
    if (record_date.getDate() !== today.getDate() && status === 'time-out') {
      setStatus(null)
      setLoading(false)
      return
    }
    // }

    switch (status) {
      case 'time-in':
        setStatus('Time in')
        break
      case 'time-out':
        setStatus('Time out')
        break
      case 'break-in':
        setStatus('Break in')
        break
      case 'break-out':
        setStatus('Break out')
        break
      default:
        setStatus(null)
        break
    }

    setLoading(false)
  }

  const ButtonMemo = React.memo(ButtonContainerMemo)

  function ButtonContainerMemo() {
    return <RenderButtonStatus />
  }

  function handleCheckboxChange(e) {
    setValidated(e.target.checked)
  }

  const geolocation = async () => {
    await navigator.geolocation.watchPosition(function (position) {
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      })
    })

    if (!location) return false
    return location
  }

  const handleUpdateStatus = async (status) => {
    try {
      setLoading(true)
      if (!status) return setLoading(false)
      await geolocation()

      if (!location.latitude && !location.longitude) return setLoading(false)
      let formatStatus = status.replace(' ', '-').toLowerCase()
      let previous = null
      let dataDate = new Date(currentDate)
      if (dataDate.getDate() !== today.getDate() || status !== 'time-in') {
        previous = currentDate
      }
      let workmate = user.displayName
      const result = await user_api.post_user_workmate_status(formatStatus, location, value, previous, workmate)
      if (!result.ok) {
        setLoading(false)
        Bugsnag.notify(result)
        return enqueueSnackbar(result.data.msg, {variant: 'error'})
      }

      switch (result.data.status) {
        case 'time-in':
          setStatus('Time out')
          break
        case 'time-out':
          setStatus('Time in')
          break
        case 'break-in':
          setStatus('Break out')
          break
        case 'break-out':
          setStatus('Break in')
          break
        default:
          break
      }

      socket.emit('update_status', status)
      enqueueSnackbar(`${status} Success`, {variant: 'success'})
      setLoading(false)
      handleStatus(value)
    } catch (error) {
      console.log(error)
    }
  }

  const RenderButtonStatus = () => {
    const cur_status = status

    switch (cur_status) {
      case null:
        return <TimeIn request={handleUpdateStatus} />
      case 'Time in':
        return (
          <>
            <TimeOut request={handleUpdateStatus} width="215px" current_status={cur_status} />
            <BreakIn request={handleUpdateStatus} width="215px" current_status={cur_status} />
            <span> for {` ${new Date(currentDate).toDateString()} `}</span>
          </>
        )
      case 'Break in':
        return (
          <>
            <BreakOut request={handleUpdateStatus} width="215px" current_status={cur_status} />
            <TimeOut request={handleUpdateStatus}  width="215px" current_status={cur_status} />
            <span> for {` ${new Date(currentDate).toDateString()} `}</span>
          </>
        )
      case 'Break out':
        return (
          <>
            <TimeOut request={handleUpdateStatus} width="215px" current_status={cur_status} />
            <BreakIn request={handleUpdateStatus} width="215px" current_status={cur_status} />
            <span> for {` ${new Date(currentDate).toDateString()} `}</span>
          </>
        )
      case 'Time out':
        return (
          <>
            <Completed currentDate={currentDate} />
            <button onClick={() => setStatus(null)}>Ok</button>
          </>
        )
      default:
        return <Loading />
    }
  }

  const handleGenerateQR = (e) => {
    setOpenQR(true);
    setId(user._id);
    setName(user.displayName);
  }

  const handleCloseQR = () => setOpenQR(false);

  const downloadQRCode = () => {
    // Generate download with use canvas and stream
    const canvas = document.getElementById("qr-gen");
    const pngUrl = canvas.toDataURL("image/png");
    let downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = `${name}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const handleUpdateLocation = async () => {
    await geolocation()
    if (location.longitude !== 0 || location.latitude !== 0) {
      const data = {
        long: location.longitude,
        lat: location.latitude
      }
      const result = await user_api.patch_user_location(user._id, data);
      console.log(location.longitude);
      if (result.status === 200) {
        alert("Location update successful");
      }  
    } else {
      alert("Please turn on your location");
    }
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

  const handleOpenHistory = async () => {
    const result = await user_api.get_limited_users(userState._id)
    setUsers(result.data)
    setOpenHistory(true)
  }

  const handleCloseHistory = async () => {
    setOpenHistory(false)
  }

  const handleChangeDate = async (date) => {
    const fomattedDate = moment(date).format('YYYY-MM-DD')
    setStartDate(date)
    const result = await user_api.get_users_bydate(userState._id, fomattedDate)
    console.log(result)
    setUsers(result.data)
  }

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

  return (
    <>
      <IconButton
        ref={anchorRef}
        onClick={handleOpen}
        sx={{
          padding: 0,
          width: 44,
          height: 44,
          ...(open && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'absolute',
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72),
            },
          }),
        }}
      >
        <Avatar src={user.image} alt="photoURL" />
      </IconButton>

      <MenuPopover open={open} onClose={handleClose} anchorEl={anchorRef.current} sx={{width: 220}}>
        <Box sx={{my: 1.5, px: 2.5}}>
          <Typography variant="subtitle1" noWrap>
            {userState.displayName}
          </Typography>
          <Typography variant="body2" sx={{color: 'text.secondary'}} noWrap>
            {userState.email}
          </Typography>
          <Typography variant="body2" sx={{color: 'text.secondary'}} noWrap>
            {userState.company}
          </Typography>
        </Box>
        <Box sx={{p: 2, pt: 1.5}}>
          <Button
            fullWidth
            color="inherit"
            variant="outlined"
            onClick={(e) => {
              handleClickOpenEdit()
            }}
          >
            Edit Company
          </Button>
        </Box>
        {user.role === 0 
          ?
            <Box sx={{p: 2, pt: 1.5}}>
              <Button
                fullWidth
                color="inherit"
                variant="outlined"
                onClick={(e) => {
                  handleOpenHistory()
                }}
              >
                Time keeping history
              </Button>
            </Box> 
          :
            ''
        }
        {user.role === 1 
          ?
            <>
              <Box sx={{p: 2, pt: 1.5}}>
                <Button
                  fullWidth
                  color="inherit"
                  variant="outlined"
                  // disabled
                  onClick={(e) => {
                    handleOpenWorkmateTimein()
                  }}
                  
                >
                  Workmate Time-in
                </Button>
              </Box>
              <Box sx={{p: 2, pt: 1.5}}>
                <Button
                  fullWidth
                  color="inherit"
                  variant="outlined"
                  // disabled
                  onClick={(e) => {
                    handleUpdateLocation()
                  }}
                  
                >
                  Update Location
                </Button>
              </Box>
            </>
          :
            ''
        }
        
        {/*<Box sx={{p: 2, pt: 1.5}}>
          <Button
            fullWidth
            color="inherit"
            variant="outlined"
            onClick={(e) => {
              handleGenerateQR()
            }}
          >
            Generate QR Code
          </Button>
        </Box>*/}

        <Divider sx={{my: 1}} />
        {user.role === 1 || user.role === 4
          ? MENU_OPTIONS.map((option) => (
              <MenuItem
                key={option.label}
                to={option.linkTo}
                component={RouterLink}
                onClick={handleClose}
                sx={{typography: 'body2', py: 1, px: 2.5}}
              >
                <Box
                  component={Icon}
                  icon={option.icon}
                  sx={{
                    mr: 2,
                    width: 24,
                    height: 24,
                  }}
                />

                {option.label}
              </MenuItem>
            ))
          : ''}
        <Box sx={{p: 2, pt: 1.5}}>
          <Button
            fullWidth
            color="inherit"
            variant="outlined"
            onClick={(e) => {
              handleSignOut(e)
            }}
          >
            Logout
          </Button>
        </Box>
      </MenuPopover>
      <Dialog open={openEdit} onClose={handleCloseEdit}>
        <DialogTitle>Update company?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Kindly make sure to add the exact name of the company/store/branch from your manager. Only use this with the
            instruction of your admin.
          </DialogContentText>
          <Formik
                      initialValues={{
                        company: `${userState.company}`,
                      }}
                      validationSchema={validationSchema}
                      onSubmit={async (data) => {
                        
                        const result = await useUser.patch_store_onboard({...userState, company:data.company}, userState._id)
                        result.data.token = userState.token
                  
                        await storage.storeUser(result.data);
                        await storage.storeToken(result.data.token)

                        if (!result.ok) 
                        {
                          Bugsnag.notify(result)
                          return enqueueSnackbar('Unable to submit your request for assitance', {variant: 'error'})
                        }
                        else {
                          /*let params = JSON.stringify({
                            username: 'Captain Sparkle',
                            avatar_url:
                              'https://www.sparkles.com.ph/static/2629bb8535ba6ae5406fc9385dadc2e0/497c6/Spark--noodles.png',
                            content: ` Time In Log - Company update \n**from:**\n ${userState.displayName} - ${userState._id} \n**Company:**\n ${userState.company} **->** ${data.company}`,
                          })
                          await discord_api.send_message(params)*/
                          setUser({...userState, company: data.company})
                          handleCloseEdit()
                          return enqueueSnackbar('Company updated.', {variant: 'success'})
                        }

                       
                      }}
                    >
                      {({values, handleChange, handleSubmit, isSubmitting}) => (
                        <form onSubmit={handleSubmit}>
                          <CustomTextField
                            autoFocus
                            margin="dense"
                            name="company"
                            label="Company"
                            fullWidth
                            variant="standard"
                            onChange={handleChange}
                          />
                         
                          <DialogActions>
                            <Button onClick={handleCloseEdit}>Cancel</Button>
                            <Button type="submit" disabled={isSubmitting}>
                              {isSubmitting ? <CircularProgress /> : 'Update'}
                            </Button>
                          </DialogActions>
                        </form>
                      )}
                    </Formik>
        </DialogContent>
      </Dialog>
      {/*Work time-in dialog box*/}
      <Dialog open={openWorkmateTimein} onClose={handleCloseWorkmateTimein}>
        <DialogTitle>Workmate Scan?</DialogTitle>
        <DialogContent>
          {value && validated ? (
            <Page title="Dashboard | Time in">
              <Container maxWidth="sm">
                <Box sx={{pb: 5}} style={{width: '100%'}}>
                  <span>Welcome, </span>
                  <Typography variant="h4" style={{color: '#000'}}>
                    {qrUser.displayName ? qrUser.displayName : `${qrUser.firstName} ${qrUser.lastName}`}
                  </Typography>
                </Box>

                <Grid
                  
                  spacing={0}
                  direction="column"
                  alignItems="center"
                  justify="center"
                  style={{minHeight: '60vh'}}
                >
                  <>
                    <Grid item xs={10}>
                      <Typography variant="h6" component="h2" style={{color: '#7f8c8d', fontWeight: '400'}}>
                        Current Time <Clock format={'LL'} ticking={true} timezone={'Asia/Manila'} />
                      </Typography>
                    </Grid>
                    <Grid item xs={10}>
                      <Typography variant="h3" component="h1">
                        <Clock format={'HH:mm:ss'} ticking={true} timezone={'Asia/Manila'} />
                      </Typography>
                    </Grid>
                  </>

                  {isLoading ? <Loading /> : <ButtonMemo />}
                </Grid>
              </Container>
            </Page>
          ) : (
            <>
              {!validated ? (
                <FormControlLabel style={{width: '250px', heigth: '200px'}} control={<Checkbox />} onChange={(e) => handleCheckboxChange(e)} label="By checking this you guarantee the presence of your workmate in the vicinity using this time-in." />
              ) : (
                  <>
                  <QrReader
                    delay={3000}
                    onError={handleError}
                    onScan={handleScan}
                    // chooseDeviceId={()=>selected}
                    style={{width: '250px', heigth: '200px'}}
                    // className={'qrScanner'}
                  />
                  <DialogTitle style={{ display: "flex", justifyContent: "center" }}>No Data found</DialogTitle>
                  </> 
                )
              }
              
            </>
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={openHistory} onClose={handleCloseHistory} maxWidth="sm" classes={{ paperScrollPaper: classes.customWidth }}>
        <AppBar sx={{ position: "relative" }}>
        <DialogTitle>Time keeping history</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleCloseHistory}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        </AppBar>
        <DialogContent>
          {/* <DatePicker selected={startDate} onChange={(date:Date) => handleChangeDate(date)} /> */}
          <div style={{paddingBottom: ".5em"}}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DesktopDatePicker
                label="Choose Date"
                value={startDate}
                minDate={new Date('2017-01-01')}
                renderInput={(params) => <TextField {...params} />}
                onChange={(date:Date) => handleChangeDate(date)}
              />
            </LocalizationProvider>
          </div>
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
                        </TableRow>
                      ))}
                    </>
                  :
                    ''
                }
                
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
      </Dialog>
      <Modal
        aria-labelledby="spring-modal-title"
        aria-describedby="spring-modal-description"
        open={openQR}
        onClose={handleCloseQR}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
         timeout: 500,
        }}
      >
        <Fade in={openQR}>
          <Box sx={style}>
            <Grid container sx={{ pl: 2 }} >
              <QRCode
                id="qr-gen" 
                size={300}
                value={user._id}
              />
            </Grid>
            <Button variant="contained" color="success" onClick={downloadQRCode} sx={{ mt: 2, px: 17 }}>
              Print QR
            </Button>
          </Box>
        </Fade>
      </Modal>
    </>
  )
}