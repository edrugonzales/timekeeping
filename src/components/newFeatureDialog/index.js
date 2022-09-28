import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
// import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import CloseIcon from '@mui/icons-material/Close';
import {IconButton} from '@material-ui/core'
const NewFeatureDialog = () => {
  const [value, setValue] = useState(true);

  const handleClose = () => {
    setValue(false);
  };

  return (
    <>
      <Dialog open={value} onClose={handleClose}>
        <AppBar sx={{ position: "relative" }}>
          <DialogTitle id="alert-dialog-title">What's New!
            <IconButton
                aria-label="close"
                onClick={handleClose}
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
          <span style={{ color: "green" }}>&#10004;</span> Please add sparkle time-keeping to homescreen of mobile for better experience
          <br />
          <br />
          <h3 style={{ paddingBottom: ".5em" }}>Instruction</h3>
          &#8226; Open <b>timein.sparkles.com.ph</b> in your mobile using chrome as browser and click the 3 dots on the upper right corner.
          <br />
          <br />
          <img src = "https://i.imgur.com/VpnkvLy.jpeg" className="h-25"></img>
          <br />
          <br />
          &#8226; Click add to homescreen
          <br />
          <br />
          <img src = "https://i.imgur.com/c3ALi38.jpg" className="h-25"></img>
          <br />
          <br />
          &#8226; Then check your mobile device homescreen for time-keeping icon
          <br />
          <br />
          <img src = "https://i.imgur.com/LQrGaBk.jpg" className="h-25"></img>
          <br />
          <br />
          &#8226; Please make it a practice to use the homescreen time-keeping for better user experience.
          <br />
          <br />
          <Button
            variant="outlined"
            color="primary"
            onClick={handleClose}
            style={{ textAlign: "center", width: "100%" }}
          >
            Close
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NewFeatureDialog;