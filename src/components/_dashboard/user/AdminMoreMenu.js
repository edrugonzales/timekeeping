import React from 'react'
import { Icon } from '@iconify/react'
import { useRef, useState, useEffect } from 'react'
// import editFill from '@iconify/icons-eva/edit-fill'
import archiveOutline from '@iconify/icons-eva/archive-outline'
import { Link as RouterLink } from 'react-router-dom'
import trash2Outline from '@iconify/icons-eva/trash-2-outline'
import moreVerticalFill from '@iconify/icons-eva/more-vertical-fill'
// material
import {
  Menu,
  MenuItem,
  IconButton,
  ListItemIcon,
  ListItemText,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
  TextField,
  Stack
} from '@material-ui/core'

import { useSnackbar } from 'notistack5'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import AppBar from "@mui/material/AppBar";
import CloseIcon from '@mui/icons-material/Close';
/*import TimePicker from 'react-time-picker'*/
//api

import useUser from 'utils/api/users'
import storage from 'utils/storage'

// ----------------------------------------------------------------------
const moment = require('moment-timezone');
moment().tz('Asia/Manila').format();
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

export default function AdminMoreMenu({ id, user, action, data }) {

  const ref = useRef(null)
  const [isOpen, setIsOpen] = useState(false)
  const [open, setOpen] = useState(false)
  const [openArchive, setOpenArchive] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)
  const { enqueueSnackbar } = useSnackbar()
  const [timein, setTimeIn] = useState(null);
  const [breakin, setBreakIn] = useState(null);
  const [breakout, setBreakOut] = useState(null);
  const [timeout, setTimeOut] = useState(null);
  const [timeinActive, setTimeinActive] = useState(false);
  const [breakinActive, setBreakinActive] = useState(false);
  const [breakoutActive, setBreakoutActive] = useState(false);
  const [timeoutActive, setTimeoutActive] = useState(false);
  const [passwordDialog, setPasswordDialog] = useState(false);
  const [password, setPassword] = useState('');

  

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

  const handleClickOpen = () => {
    setOpen(true)
    setIsOpen(false)
  }

  useEffect(() => {
  	if (data.Records.length <= 0) {
  		const timein = "n/a"
  		const breakin = "n/a"
  		const breakout = "n/a"
  		const timeout = "n/a"
  	}
  	else {
  		const timein = filterByStatus(data.Records[0].record, 'time-in').time
  		const breakin = filterByStatus(data.Records[0].record, 'break-in').time
  		const breakout = filterByStatus(data.Records[0].record, 'break-out').time
  		const timeout = filterByStatus(data.Records[0].record, 'time-out').time
  		setTimeIn(moment(timein, 'h:mm a').format()) 
  		setBreakIn(moment(breakin, 'h:mm a').format())
  		setBreakOut(moment(breakout, 'h:mm a').format())
  		setTimeOut(moment(timeout, 'h:mm a').format())
      
  	}
  	action("")
      
  }, [])

  const handleClickEdit = () => {

    if (filterByStatus(data.Records[0].record, 'time-in').time === "n/a") {
      setTimeinActive(true)
    }
    if (filterByStatus(data.Records[0].record, 'break-in').time === "n/a") {
      setBreakinActive(true)
    }
    if (filterByStatus(data.Records[0].record, 'break-out').time === "n/a") {
      setBreakoutActive(true)
    }
    if (filterByStatus(data.Records[0].record, 'time-out').time === "n/a") {
      setTimeoutActive(true)
    }
    setOpenEdit(true)
    setIsOpen(false)
  }

  const handleClose = () => {
    setIsOpen(false)
    setOpen(false)
  }

  const handleCloseEdit = () => {
    setOpenEdit(false)
    setOpen(false)
  }

  const handleClickOpenArchive = () => {
    setOpenArchive(true)
    setIsOpen(false)
  }

  const handleCloseArchive = () => {
    setOpenArchive(false)
    setOpen(false)
  }

  const handleClickPasswordOpen = () => {
    setPasswordDialog(true)
    setIsOpen(false)
  }

  const handleClosePasswordDialog = () => {
    setPasswordDialog(false)
    setOpen(false)
  }

  const handleRemove = async () => {
    const local_user = await storage.getUser()
    if (!local_user) {
      setOpen(false)
      return enqueueSnackbar('Unable to process action', { variant: 'error' })
    }

    if (!id) {
      setOpen(false)
      return enqueueSnackbar('Unable to remove the user', { variant: 'error' })
    }

    const user = JSON.parse(local_user)
    const result = await useUser.delete_last_record_by_id(id)

    if (!result.ok) return enqueueSnackbar(result.data.msg, { variant: 'error' })

    enqueueSnackbar('Record deleted success', { variant: 'success' })
    setOpen(false)
    action("delete last record success")
  }

  const handleArchive = async () => {
    const local_user = await storage.getUser()

    if (!local_user) {
      setOpen(false)
      return enqueueSnackbar('Unable to process action', { variant: 'error' })
    }

    if (!id) {
      setOpen(false)
      return enqueueSnackbar('Unable to remove the user', { variant: 'error' })
    }

    const user = JSON.parse(local_user)
    const result = await useUser.delete_record_by_id(id)
    if (!result.ok) return enqueueSnackbar(result.data.msg, { variant: 'error' })

    enqueueSnackbar('Record deleted success', { variant: 'success' })
    action("delere record success")
    setOpen(false)
    setOpenArchive(false)
    
  }

  const handleEdit = async () => {

    const local_user = await storage.getUser()

    if (!local_user) {
      setOpenEdit(false)
      return enqueueSnackbar('Unable to process action', { variant: 'error' })
    }

    if (!id) {
      setOpenEdit(false)
      return enqueueSnackbar('Unable to remove the user', { variant: 'error' })
    }

    const user = JSON.parse(local_user)
    const timeData = {
      timein: moment(timein).format("h:mm a"),
      breakin: moment(breakin).format("h:mm a"),
      breakout: moment(breakout).format("h:mm a"),
      timeout: moment(timeout).format("h:mm a")
    }
    const result = await useUser.update_record_by_id(id, timeData)

    if (!result.ok) return enqueueSnackbar(result.data.msg, { variant: 'error' })

    enqueueSnackbar('Record update success', { variant: 'success' })
    action("edit success")
    setOpenEdit(false)
    
  }

  const handleChangePassword = async () => {
    if (password === null || password === "") {
      alert("Please input password")
    }
    else {
      const result = await useUser.update_user_password(user, password)
      if (result.status === 200) {
        alert("Password update success")
        setPasswordDialog(false)    
      }
      else {
        alert("Something went wrong please try again later")
      }

    }
  }

  return (

    <>

      <IconButton ref={ref} onClick={() => setIsOpen(true)}>
        <Icon icon={moreVerticalFill} width={20} height={20} />
      </IconButton>
      {data.Records.length > 0 
        ? 
          <Menu
            open={isOpen}
            anchorEl={ref.current}
            onClose={() => setIsOpen(false)}
            PaperProps={{
              sx: { width: 200, maxWidth: '100%' },
            }}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <MenuItem component={RouterLink} to="#" sx={{ color: 'text.secondary' }}>
              <ListItemIcon>
                <Icon icon={archiveOutline} width={24} height={24} />
              </ListItemIcon>
              <ListItemText
                primary="Edit Record"
                onClick={handleClickEdit}
                primaryTypographyProps={{ variant: 'body2' }}
              />
            </MenuItem>
            <MenuItem component={RouterLink} to="#" sx={{ color: 'text.secondary' }}>
              <ListItemIcon>
                <Icon icon={archiveOutline} width={24} height={24} />
              </ListItemIcon>
              <ListItemText
                primary="Delete Record"
                onClick={handleClickOpenArchive}
                primaryTypographyProps={{ variant: 'body2' }}
              />
            </MenuItem>
            <MenuItem component={RouterLink} to="#" sx={{ color: 'text.secondary' }}>
              <ListItemIcon>
                <Icon icon={archiveOutline} width={24} height={24} />
              </ListItemIcon>
              <ListItemText
                primary="Delete Last Record"
                onClick={handleClickOpen}
                primaryTypographyProps={{ variant: 'body2' }}
              />
            </MenuItem>
            <MenuItem component={RouterLink} to="#" sx={{ color: 'text.secondary' }}>
              <ListItemIcon>
                <Icon icon={archiveOutline} width={24} height={24} />
              </ListItemIcon>
              <ListItemText
                primary="Reset Password"
                onClick={handleClickPasswordOpen}
                primaryTypographyProps={{ variant: 'body2' }}
              />
            </MenuItem>
          </Menu>   
        : 
        	<Menu
        	  open={isOpen}
        	  anchorEl={ref.current}
        	  onClose={() => setIsOpen(false)}
        	  PaperProps={{
        	    sx: { width: 200, maxWidth: '100%' },
        	  }}
        	  anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        	  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        	>
		        <MenuItem component={RouterLink} to="#" sx={{ color: 'text.secondary' }}>
		            <ListItemIcon>
		              <Icon icon={archiveOutline} width={24} height={24} />
		            </ListItemIcon>
		            <ListItemText
		              primary="Reset Password"
		              onClick={handleClickPasswordOpen}
		              primaryTypographyProps={{ variant: 'body2' }}
		            />
		        </MenuItem>
	        </Menu>  
      }
     

      <div>
        <Dialog
          open={open}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleClose}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle id="alert-dialog-slide-title">{'Do you wish to proceed with this action?'}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              Once action processed the record will be deleted.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              No
            </Button>
            <Button onClick={handleRemove} color="primary">
              Yes
            </Button>
          </DialogActions>
        </Dialog>
      </div>

      <div>
        <Dialog
          open={openArchive}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleCloseArchive}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle id="alert-dialog-slide-title">{'Do you wish to restore this User?'}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              Once action processed the record will be deleted.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseArchive} color="primary">
              No
            </Button>
            <Button onClick={handleArchive} color="primary">
              Yes
            </Button>
          </DialogActions>
        </Dialog>
      </div>

      <div>
        <Dialog
          open={openEdit}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleCloseEdit}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle id="alert-dialog-slide-title">Edit Record</DialogTitle>
          <DialogContent>
            Time-in:
            <br/> 
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <TimePicker
                value={timein}
                onChange={setTimeIn}
                renderInput={(params) => <TextField {...params} />}
                readOnly={timeinActive}
              />
            </LocalizationProvider>
            <br/>
            <br/>
            Break-in: 
            <br/>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <TimePicker
                value={breakin}
                onChange={setBreakIn}
                renderInput={(params) => <TextField {...params} />}
                readOnly={breakinActive}
              />
            </LocalizationProvider>
            <br/>
            <br/>
            Break-out:
            <br/>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <TimePicker
                value={breakout}
                onChange={setBreakOut}
                renderInput={(params) => <TextField {...params} />}
                readOnly={breakoutActive}
              />
            </LocalizationProvider>
            <br/>
            <br/>
            Time-out: 
            <br/>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <TimePicker
                value={timeout}
                onChange={setTimeOut}
                renderInput={(params) => <TextField {...params} />}
                readOnly={timeoutActive}
              />
            </LocalizationProvider>
            <br/>
            <br/>
            <Button sx={{mt: 5, width: "100%"}} variant="contained" onClick={handleEdit}>Submit</Button>
          </DialogContent>
    }
  }

{/*          <DialogActions>
            <Button onClick={handleClose} color="primary">
              No
            </Button>
            <Button onClick={handleRemove} color="primary">
              Yes
            </Button>
          </DialogActions>*/}
        </Dialog>
      </div>
      <div>
        <Dialog open={passwordDialog}>
          <AppBar sx={{ position: "relative" }}>
            <DialogTitle id="alert-dialog-title">
              Reset Password!
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
            {data 
              ? 
                data.Employee.displayName
              :
                ''
            }
            
            <br />
            <br />
            <TextField id="standard-basic" label="Enter new Password" variant="standard" value={password} onChange={(e)=>setPassword(e.target.value)} required/>
            <Button sx={{ml: 3, mt: 1}} variant="contained" onClick={handleChangePassword}>Submit</Button>
          </DialogContent>
        </Dialog> 
      </div>
    </>
  )
}