// material
import { Grid, Box } from '@material-ui/core'

export default function Loading() {

    return (
        <>
            <Grid item xs={12}>
                <Box
                    component="img"
                    src="/static/illustrations/loading.gif"
                    sx={{ height: 300, mx: 'auto', my: { xs: 0, sm: 0 } }}
                />
            </Grid>
        </>
    )
}

