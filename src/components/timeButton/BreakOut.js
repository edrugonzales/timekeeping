// material
import { Grid, Box, Button } from '@material-ui/core'
import {useEffect, useState} from 'react'
// ----------------------------------------------------------------------

export default function BreakOut({ request, current_status, width, location }) {
    const handleStatusClick = async (e, status) => {
        e.preventDefault()
        request(status)
    }

    return (
        <>
            <Grid item xs={12}>
                <Box marginTop={3} sx={{ display: 'block', width: {width} }}>
                    {current_status === 'Break in' ? (
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
                    <Button
                        fullWidth
                        size="large"
                        variant="outlined"
                        style={{ borderColor: '#34495e', color: '#34495e' }}
                        onClick={(e) => handleStatusClick(e, 'Break out')}
                    >
                        Break out
                    </Button>
                </Box>
            </Grid>
        </>
    )
}
