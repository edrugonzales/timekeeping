// material
import { Grid, Box } from '@material-ui/core'

export default function LocationLoading() {

    return (
        <>
            <Grid item xs={12}>
                <Box
                    component="img"
                    src="/static/illustrations/loading.gif"
                    sx={{ height: 300, mx: 'auto', my: { xs: 0, sm: 0 } }}
                />
                <h4>Please wait while we get your current location. <br/>If your location is not turn yet turned on. Please turn it on. <br/>If your location is already turned on. Please refresh the application!</h4>
            </Grid>
        </>
    )
}

