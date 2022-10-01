import React, { useState, useEffect } from 'react'
// material
import {
    Grid,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Slide,
} from '@material-ui/core'
import Timeout from "../../assets/svg/TIMEOUT.svg"
// ----------------------------------------------------------------------

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />
})

export default function BreakOut({ request, current_status, width, location }) {
    const [open, setOpen] = useState(false)
    const handleClickOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    const handleUpdateStatus = async (e, status) => {
        e.preventDefault()
        setOpen(false)
        request(status)
    }
    return (
        <>
            <Grid item xs={12}>
                <Box marginTop={3} sx={{ display: 'block', width: {width} }}>
                    {current_status === 'Break out' || current_status === 'Time in' ? (
                        <Box>
                            <iframe 
                                title="resumeIframe"
                                src={`https://maps.google.de/maps?hl=en&q=${location.latitude},${location.longitude}&ie=UTF8&t=&z=17&iwloc=B&output=embed`}                            
                                width="300" 
                                height="280" 
                                frameBorder="0"
                                scrolling="no"
                                marginHeight="0"
                                marginWidth="0"
                                allowfullscreen=""
                                key={`landmark-${location.latitude}`} 
                                >
                            </iframe>
                            <h3 style={{"margin-left": '80px'}}>Current Location</h3>
                        </Box>
                    ) : (
                        ''
                    )}

                    <img
                        src={Timeout}
                        onClick={(e) => handleClickOpen(e, 'Time out')}
                        style={{ width: "100px", justifyContent: "center" }}
                    />
                </Box>
            </Grid>
            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle id="alert-dialog-slide-title">{'Do you wish to Time-out?'}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        Once time-out you won't be able to time-in again.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        No
                    </Button>
                    <Button onClick={(e) => handleUpdateStatus(e, 'Time out')} color="primary">
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}
