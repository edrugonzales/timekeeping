import { forwardRef } from 'react'
import TextField from '@material-ui/core/TextField'

const phoneInput = (props, ref) => {
    return (

        <TextField
            {...props}
            inputRef={ref}
            fullWidth
            size='small'
            label='Phone Number'
            variant='outlined'
            name='phone'
        />
    )
}
export default forwardRef(phoneInput)