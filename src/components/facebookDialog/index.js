import React from 'react'
// import Button from "@material-ui/core/Button"
import Dialog from '@material-ui/core/Dialog'
// import DialogActions from "@material-ui/core/DialogActions"
// import DialogContent from "@material-ui/core/DialogContent"
// import DialogContentText from "@material-ui/core/DialogContentText"
// import DialogTitle from "@material-ui/core/DialogTitle"
import {Typography} from '@material-ui/core'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import IosShareIcon from '@mui/icons-material/IosShare'

const FacebookDialog = (permitted) => {
  return (
    <>
      <Dialog open={permitted}>
        {/* <DialogTitle id="alert-dialog-title">
          We noticed that you open the link from Messenger!
        </DialogTitle> */}
        <Typography id="spring-modal-description" sx={{m: 2}} style={{fontWeight: 'bold'}}>
          We noticed that you open the app from Facebook Messenger!
        </Typography>
        {/* <Button
            variant="outlined"
            color="primary"
            onClick={() => window.location.reload()}
            style={{ textAlign: "center", width: "100%" }}
          >
            Try Again
          </Button> */}
        <div style={{textAlign: 'center'}}>
          <img
            src={'https://www.timein.sparkles.com.ph/static/logo.svg'}
            style={{display: 'block', margin: 'auto', width: '50%'}}
          />
        </div>
        <Typography sx={{m: 2}} style={{fontWeight: 'bold'}}>
          Add Timein app to your home screen?
        </Typography>
        <Typography id="spring-modal-description" sx={{m: 2}} variant="body2">
          Install this application on your home screen for quick and easy access when you're on the go.
        </Typography>
        <div style={{padding: '.2rem'}}>
          <Typography style={{fontWeight: 'bold', textAlign: 'center'}}>Android</Typography>

          <Typography variant="body2" style={{paddingLeft: '.5rem'}}>
            Just tap
            <span style={{verticalAlign: 'middle'}}>
              <MoreVertIcon />
            </span>
            then "Open Google Chrome"
          </Typography>
        </div>
        <div style={{padding: '.2rem'}}>
          <Typography style={{fontWeight: 'bold', textAlign: 'center'}}>IOS</Typography>

          <Typography variant="body2" style={{paddingLeft: '.5rem'}}>
            Just tap
            <span style={{verticalAlign: 'middle'}}>
              <IosShareIcon style={{paddingLeft: '.2rem', paddingRight: '.2rem'}} />
            </span>
            then "Open Safari"
          </Typography>
        </div>
      </Dialog>
    </>
  )
}

export default FacebookDialog
