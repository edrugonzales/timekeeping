import React, {useEffect, useState, useContext} from 'react'
import jwt_decode from 'jwt-decode'
// material
import {
  Box, 
  Grid, 
  Container, 
  Typography, 
  Button, 
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  Checkbox,
  Backdrop,
  Fade,
  Modal,
  IconButton
} from '@material-ui/core'
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
// components
import Page from '../components/Page'
import {useSnackbar} from 'notistack5'
import {SocketContext} from 'utils/context/socket'
import {useNavigate} from 'react-router-dom'
import PromotionDialog from 'components/promotionDialog'
import {BreakOut, BreakIn, TimeIn, TimeOut, Completed, Loading} from 'components/timeButton'
import LocationLoading from 'components/timeButton/LocationLoading'
import HelpButton from 'components/discord'
import FacebookDialog from 'components/facebookDialog'
import NewFeatureDialog from 'components/newFeatureDialog'
import { LazyLoadImage } from "react-lazy-load-image-component"
import user_api from 'utils/api/users'
import storage from 'utils/storage'
import Clock from 'react-live-clock'
import Bugsnag from '@bugsnag/js'
import QrReader from 'react-qr-reader'
import QRCode from "qrcode.react"
import UAParser from 'ua-parser-js'
// ----------------------------------------------------------------------
const moment = require('moment-timezone')
moment().tz('Asia/Manila').format()
const current_date = `${moment().tz('Asia/Manila').toISOString(true)}`

let parser = new UAParser()
let browser = parser.getBrowser()

const DashboardApp = () => {
  let today = new Date(current_date)
  const navigate = useNavigate()
  const socket = useContext(SocketContext)
  const [status, setStatus] = useState(null)
  const [workmateStatus, setWorkmateStatus] = useState(null)
  const [currentDate, setCurrentDate] = useState(null)
  const [user, setUser] = useState({})
  const [report, setReport] = useState({})
  const [workmateReport, setWorkmateReport] = useState({})
  const [isLoading, setLoading] = useState(false)
  const [value, setValue] = useState(null)
  const [validated, setValidated] = useState(false)
  const [id, setId] = useState('')
  const [name, setName] = useState('')
  const [ip, setIp] = useState('')
  const [openQR, setOpenQR] = useState(false)
  const [storeLoc, setStoreLocation] = useState(false)
  const [openWorkmateTimein, setOpenWorkmateTimein] = useState(false)
  const {enqueueSnackbar} = useSnackbar()
  const [qrUser, setQrUser] = useState({})
  const [banners, setBanners] = useState([])
  const [location, setLocation] = useState({
    latitude: 0,
    longitude: 0,
  })
  const [promotionDialogState, setpromotionDialogState] = useState({
    showDialog: false,
    promotion: {},
  })
  const [open, setOpen] = useState(false)

  let browserName = browser.name
  if (location.latitude === 0) {

  }
  
  const load = async () => {
    setLoading(true)
    const token = await storage.getToken()
    const current_date = new Date()
    if (!token) {
      await storage.remove()
      return navigate('/login')
    }

    const inuser = await user_api.get_user(jwt_decode(token)['id'])
    const company = {
      "company": inuser.data.company
    }
    const storeLocation = await user_api.get_store_location(company)
    
    if (storeLocation.data.length > 0) {
      setStoreLocation(true) 
    }
    
    if (!inuser.ok) {
      Bugsnag.notify(inuser)
      await storage.remove()
      return navigate('/login')
    }

    if (jwt_decode(token)['exp'] * 1000 < current_date.getTime()) {
      await storage.remove()
      return navigate('/login')
    }
    handleStatus(inuser.data._id)
    geolocation()
    const version = await user_api.get_storyblok_version()
    const bannerRequest = await user_api.get_storyblok_banners(version)
    setBanners(bannerRequest.data.story.content.slide) 
    return setUser(inuser.data)
    setLoading(false)
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
  useEffect(() => {
    if (browserName.includes('Facebook')) {
      setOpen(true)
    }

    load()
  }, [])

  useEffect(() => {
    if (location.latitude === 0) {
      navigator.geolocation.watchPosition(function (position) {
        setLocation({
         latitude: position.coords.latitude,
         longitude: position.coords.longitude,
        })
      })
      setLoading(true)
    } 

  }, [location, currentDate])

  useEffect(() => {
    load()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enqueueSnackbar])

  const geolocation = async () => {
    if (location.latitude === 0) {
      await navigator.geolocation.watchPosition(function (position) {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
      })
    }
    if (!location) return false
    return location  
  }

   const handleUpdateWorkmateStatus = async (status) => {
    let success = false
    try {
      setLoading(true)
      if (!status) return setLoading(false)
      const loc = await geolocation()
      if (location.latitude === 0 && location.longitude === 0) {
        await navigator.geolocation.watchPosition(function (position) {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          })
        })
        alert('Please turn on location.\n \nHaving trouble using the web application? Try using the homescreen app for better user experience.\n \nPlease refresh this page to get prompt on how to add time-keeping to your mobile homescreen.')
        setLoading(false)
      }
      else {
        if (status === "Time in" && storeLoc === true) {
          const formattedLoc = {"long": location.longitude, "lat": location.latitude}
          const storeDistance = await user_api.post_store_distance(formattedLoc)
          if (storeDistance.data.length <= 0) {
            alert("Time-in error not in the store vicinity yet")
            setLoading(false)
          }
          else {
            for (var i = storeDistance.data.length - 1; i >= 0; i--) {
              if (storeDistance.data[i].company === user.company) {
                success = true
              }
            }
            if (!success) {
              alert("Time-in error not in the store vicinity yet")
              setLoading(false)
            }
            else {
              let formatStatus = status.replace(' ', '-').toLowerCase()
              let previous = null
              let dataDate = new Date(currentDate)
              if (dataDate.getDate() !== today.getDate() || status !== 'time-in') {
                previous = currentDate
              }
              let workmate = user.displayName
              let processDate = workmateReport._id

              const result = await user_api.post_user_workmate_status(formatStatus, location, value, processDate, workmate)
              if (!result.ok) {
                setLoading(false)
                Bugsnag.notify(result)
                return enqueueSnackbar(result.data.msg, {variant: 'error'})
              }

              switch (result.data.status) {
                case 'time-in':
                  setWorkmateStatus('Time out')
                  break
                case 'time-out':
                  setWorkmateStatus('Time in')
                  break
                case 'break-in':
                  setWorkmateStatus('Break out')
                  break
                case 'break-out':
                  setWorkmateStatus('Break in')
                  break
                default:
                  break
              }

              socket.emit('update_status', status)
              enqueueSnackbar(`${status} Success`, {variant: 'success'})
              setLoading(false)
              handleWorkmateStatus(value)
            }
            
          }
        }
        else {
          let formatStatus = status.replace(' ', '-').toLowerCase()
          let previous = null
          let dataDate = new Date(currentDate)
          if (dataDate.getDate() !== today.getDate() || status !== 'time-in') {
            previous = currentDate
          }
          let workmate = user.displayName
          let processDate = workmateReport._id

          const result = await user_api.post_user_workmate_status(formatStatus, location, value, processDate, workmate)
          if (!result.ok) {
            setLoading(false)
            Bugsnag.notify(result)
            return enqueueSnackbar(result.data.msg, {variant: 'error'})
          }

          switch (result.data.status) {
            case 'time-in':
              setWorkmateStatus('Time out')
              break
            case 'time-out':
              setWorkmateStatus('Time in')
              break
            case 'break-in':
              setWorkmateStatus('Break out')
              break
            case 'break-out':
              setWorkmateStatus('Break in')
              break
            default:
              break
          }

          socket.emit('update_status', status)
          enqueueSnackbar(`${status} Success`, {variant: 'success'})
          setLoading(false)
          handleWorkmateStatus(value)
        }
      }    
    } catch (error) {
      console.log(error)
    }
  }

  const handleUpdateStatus = async (status) => {
    try {
      let success = false
      setLoading(true)
      const loc = await geolocation()
      if (!status) return setLoading(false)

      if (location.latitude === 0 && location.longitude === 0) {
        await navigator.geolocation.watchPosition(function (position) {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          })
        })
        alert('Please turn on location.\n \nHaving trouble using the web application? Try using the homescreen app for better user experience.\n \nPlease refresh this page to get prompt on how to add time-keeping to your mobile homescreen.')
        setLoading(false)
      }
      else {
        if (status === "Time in" && storeLoc === true) {
          const formattedLoc = {"long": location.longitude, "lat": location.latitude}
          const storeDistance = await user_api.post_store_distance(formattedLoc)
          if (storeDistance.data.length <= 0) {
            alert("Time-in error not in the store vicinity yet")
            setLoading(false)
          }
          else {
            for (var i = storeDistance.data.length - 1; i >= 0; i--) {
              if (storeDistance.data[i].company === user.company) {
                success = true
              }
            }
            if (!success) {
              alert("Time-in error not in the store vicinity yet")
              setLoading(false)
            }
            else {
              let formatStatus = status.replace(' ', '-').toLowerCase()
                let previous = null
                let dataDate = new Date(currentDate)
                if (dataDate.getDate() !== today.getDate() || status !== 'time-in') {
                  previous = currentDate
                }
                const result = await user_api.post_user_status(formatStatus, location, user._id, report._id)
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
              handleStatus(user._id)  
            }
          }
        }
        else {
          let formatStatus = status.replace(' ', '-').toLowerCase()
          let previous = null
          let dataDate = new Date(currentDate)
          if (dataDate.getDate() !== today.getDate() || status !== 'time-in') {
            previous = currentDate
          }
          const result = await user_api.post_user_status(formatStatus, location, user._id, report._id)
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
          handleStatus(user._id) 
        }
        
      }  
    } catch (error) {
      console.log(error)
    }
  }

  const handleWorkmateStatus = async (_id) => {
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
      setWorkmateStatus(null)
    }

    if (!result || !result.data) {
      setWorkmateStatus(null)
      return setLoading(false)
    }

    if (!result.data) return setLoading(false)
    let {status, date} = result.data[0] // get the last data

    let record_date = new Date(date)

    // if (record_date.getDate() === today.getDate() && record_date.getUTCMonth() + 1 === today.getUTCMonth() + 1) {
    setWorkmateStatus(status)
    setCurrentDate(date)
    setWorkmateReport(result.data[0])
    // } else {
    if (record_date.getDate() !== today.getDate() && status === 'time-out') {
      setWorkmateStatus(null)
      setLoading(false)
      return
    }
    // }

    switch (status) {
      case 'time-in':
        setWorkmateStatus('Time in')
        break
      case 'time-out':
        setWorkmateStatus('Time out')
        break
      case 'break-in':
        setWorkmateStatus('Break in')
        break
      case 'break-out':
        setWorkmateStatus('Break out')
        break
      default:
        setWorkmateStatus(null)
        break
    }

    setLoading(false)
  }

  const handleStatus = async (_id) => {
    if (!_id) {
      setLoading(false)
      return navigate('/login')
    }

    setLoading(true)
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
    setReport(result.data[0])
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
  const WorkmateButtonMemo = React.memo(WorkmateButtonContainerMemo)

  function ButtonContainerMemo() {
    return <RenderButtonStatus />
  }

   function WorkmateButtonContainerMemo() {
    return <WorkmateRenderButtonStatus />
  }

  const RenderButtonStatus = () => {
    const cur_status = status
    switch (cur_status) {
      case null:
        return <TimeIn request={handleUpdateStatus} location={location} />
      case 'Time in':
        return (
          <>
            <TimeOut request={handleUpdateStatus} current_status={cur_status} width="300px" location={location}  />
            <BreakIn request={handleUpdateStatus} current_status={cur_status} width="300px" location={location} />
            <span> for {` ${new Date(currentDate).toDateString()} `}</span>
          </>
        )
      case 'Break in':
        return (
          <>
            <BreakOut request={handleUpdateStatus} current_status={cur_status} width="300px" location={location} />
            <TimeOut request={handleUpdateStatus} current_status={cur_status} width="300px" location={location} />
            <span> for {` ${new Date(currentDate).toDateString()} `}</span>
          </>
        )
      case 'Break out':
        return (
          <>
            <TimeOut request={handleUpdateStatus} current_status={cur_status} width="300px" location={location} />
            <BreakIn request={handleUpdateStatus} current_status={cur_status} width="300px" location={location} />
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

  const WorkmateRenderButtonStatus = () => {
    const cur_status = workmateStatus

    switch (cur_status) {
      case null:
        return <TimeIn request={handleUpdateWorkmateStatus} location={location}/>
      case 'Time in':
        return (
          <>
            <TimeOut request={handleUpdateWorkmateStatus} width="215px" current_status={cur_status} location={location}/>
            <BreakIn request={handleUpdateWorkmateStatus} width="215px" current_status={cur_status} location={location}/>
            <span> for {` ${new Date(currentDate).toDateString()} `}</span>
          </>
        )
      case 'Break in':
        return (
          <>
            <BreakOut request={handleUpdateWorkmateStatus} width="215px" current_status={cur_status} location={location}/>
            <TimeOut request={handleUpdateWorkmateStatus}  width="215px" current_status={cur_status} location={location}/>
            <span> for {` ${new Date(currentDate).toDateString()} `}</span>
          </>
        )
      case 'Break out':
        return (
          <>
            <TimeOut request={handleUpdateWorkmateStatus} width="215px" current_status={cur_status} location={location}/>
            <BreakIn request={handleUpdateWorkmateStatus} width="215px" current_status={cur_status} location={location}/>
            <span> for {` ${new Date(currentDate).toDateString()} `}</span>
          </>
        )
      case 'Time out':
        return (
          <>
            <Completed currentDate={currentDate} />
            <button onClick={() => setWorkmateStatus(null)}>Ok</button>
          </>
        )
      default:
        return <Loading />
    }
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
      handleWorkmateStatus(res)
    }
  }
  const handleError = (err) => {
    console.error(err)
  }

  function handleCheckboxChange(e) {
    setValidated(e.target.checked)
  }

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

  const handleGenerateQR = (e) => {
    setOpenQR(true);
    setId(user._id);
    setName(user.displayName);
  }
  const handleCloseQR = () => setOpenQR(false);
  return (
    <Page title="Dashboard | Time in">
      <NewFeatureDialog />
      {!open ? (
        <Container maxWidth="xl">
          <Box sx={{pb: 5}} style={{width: '100%'}}>
            <span>Welcome back,</span>
            <Typography variant="h4" style={{color: '#000'}}>
              {user.displayName ? user.displayName : `${user.firstName} ${user.lastName}`}
            </Typography>
          </Box>

          <Grid
            container
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
{/*            <label>{location.latitude}</label>*/}
            {location.latitude === 0 ? <LocationLoading />  : isLoading ? <Loading /> : <ButtonMemo />}

            <Box marginTop={3}>
              <Button
                  fullWidth
                  size="large"
                  variant="contained"
                  style={{width: "300px"}}
                  onClick={(e) => {
                    handleOpenWorkmateTimein()
                  }}
              >
                  Workmate - Time in
              </Button>
            </Box>
            <Box marginTop={3}>
              <Button
                  fullWidth
                  size="large"
                  variant="contained"
                  style={{width: "300px"}}
                  onClick={(e) => {
                    handleGenerateQR()
                  }}
              >
                  Generate QR Code
              </Button>
            </Box>
            <HelpButton />
            <div className="horizontallist scrollbar-hidden">
              {banners.map((banner) => {
                return (
                  <div key={banner._uid}>
                    <LazyLoadImage
                      style={{
                        width: "200px",
                        height: "200px",
                        margin: "10px",
                        objectFit: "cover",
                      }}
                      placeholder={<span>loading</span>}
                      effect="blur"
                      src={banner.image.filename}
                      alt={banner.title}
                      onClick={() => {
                        if (banner.redirect) {
                          window.location.href = banner.link
                        } else {
                          setpromotionDialogState((prevState) => ({
                            ...prevState,
                            showDialog: true,
                            promotion: banner,
                          }))
                        }
                      }}
                    />
                    <PromotionDialog
                      showDialog={promotionDialogState.showDialog}
                      promotion={promotionDialogState.promotion}
                      onClose={() => {
                        setpromotionDialogState((prevState) => ({
                          ...prevState,
                          showDialog: false,
                        }))
                      }}
                    />
                  </div>

                )
              })}
            </div>
          </Grid>
          <Dialog open={openWorkmateTimein} onClose={handleCloseWorkmateTimein}>
            <DialogTitle>Workmate Scan?  
              <IconButton
                aria-label="close"
                onClick={handleCloseWorkmateTimein}
                sx={{
                  position: 'absolute',
                  right: 8,
                  top: 8,
                  color: (theme) => theme.palette.grey[500],
                }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle >
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

                      {isLoading ? <Loading /> : <WorkmateButtonMemo />}
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
                <Grid container sx={{ pl: 2, mb: 2 }} style={{display: 'flex' ,'justify-content': 'center'}}>
                  <Typography variant="h6" component="h2" style={{color: 'black', fontWeight: '1000'}}>
                    {name}
                  </Typography>
                  <IconButton
                    aria-label="close"
                    onClick={handleCloseQR}
                    sx={{
                      position: 'absolute',
                      right: 8,
                      top: 8,
                      color: (theme) => theme.palette.grey[500],
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                </Grid>
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
          
        </Container>
      ) : (
        <FacebookDialog permitted={open} />

      )}
    </Page>
  )
}

export default DashboardApp