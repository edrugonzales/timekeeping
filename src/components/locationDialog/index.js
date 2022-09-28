import React from "react"
import Button from "@material-ui/core/Button"
import Dialog from "@material-ui/core/Dialog"
// import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
import DialogContentText from "@material-ui/core/DialogContentText"
import DialogTitle from "@material-ui/core/DialogTitle"


const LocationNeededDialog = (permitted) => {
  return (
    <>
      <Dialog open={permitted}>
        <DialogTitle id="alert-dialog-title">Warning!</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Please turn on location permission in order to use the app.
            <br/>
            
          </DialogContentText>
          <p style={{textAlign:"center", marginTop:'1em'}}>
              Turned on your location?
          </p>

          <Button
            variant="outlined"
            color="primary"
            onClick={() => window.location.reload()}
            style={{textAlign:"center", width:'100%'}}
          >
            Try Again
          </Button>
            
        </DialogContent>
      </Dialog>
    </>
  )
}

export default LocationNeededDialog
