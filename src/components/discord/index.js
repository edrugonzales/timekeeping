import React, { useState } from 'react'
import { Button } from '@material-ui/core'
import { Icon } from '@iconify/react'
import helpIcon from '@iconify/icons-eva/question-mark-circle-outline'
import DiscordDialog from './DiscordDialog'

export default function HelpButton() {
  const [open, setOpen] = useState(false)

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <div style={{ width: '100%', textAlign: 'center', marginTop: '32px' }}>
      <a
        size="small"
        color="inherit"
        variant="text"
        endIcon={<Icon icon={helpIcon} />}
        target="_blank"
        href="https://docs.google.com/document/d/1P7V38LsyHa5PdG52xnk25uMou9aITA9ZD0bN_Q_-RRM"
      >
        Need Help?
      </a>
      <DiscordDialog open={open} handleClose={handleClose} />
    </div>
  )
}
