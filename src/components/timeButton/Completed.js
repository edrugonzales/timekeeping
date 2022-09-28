// material
import { Grid, Box, Typography } from '@material-ui/core'

export default function Completed({currentDate}) {

    let displayDate = new Date(currentDate)
    return (
        <>
            <Grid item xs={12}>
                <Box sx={{ p: 0 }} style={{ width: '100%', textAlign: 'center' }}>
                    <Box
                        component="img"
                        src="/static/illustrations/duty-complete.gif"
                        sx={{ height: 300, mx: 'auto', my: { xs: 0, sm: 0 } }}
                    />

                    <Typography variant="h2" color={'#1ccaff'} style={{ marginTop: '-5vw' }}>
                    {`${displayDate.toDateString()} `} Duty Completed!
                    </Typography>
                </Box>
            </Grid>
        </>
    )
}

