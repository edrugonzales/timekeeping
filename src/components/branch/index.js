import React, { useState } from 'react'
import { Button } from '@material-ui/core'
import { Icon } from '@iconify/react'
import plusFill from '@iconify/icons-eva/plus-fill';
import BranchDialog from './BranchDialog'

export default function BranchButton() {
    const [open, setOpen] = useState(false)

    const handleClickOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    return (
        <div style={{ width: '100%', textAlign: 'right', marginTop: '32px' }}>
            <Button
                size="small"
                variant="contained"
                endIcon={<Icon icon={plusFill} />}
                onClick={() => handleClickOpen()}
            >
                Create New Branch
            </Button>
            <BranchDialog open={open} handleClose={handleClose} />
        </div>
    )
}
