import { Dialog, DialogContent, DialogTitle, Fab, Tooltip, DialogContentText, DialogActions, Button } from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";
import RestrictedAccess from "@components/Restricted";
import LockOutlineIcon from '@mui/icons-material/LockOutline'
import LockOpenIcon from '@mui/icons-material/LockOpen'
import { TransitionUp } from "@components/Tansitions";

export default function EditLock(props: {
  locked: boolean, 
  setLocked: Dispatch<SetStateAction<boolean>>,
  userFirstName?: string | null
})
{
  const [openDialog, setOpenDialog] = useState(false);

  function handleLockUnlock(): void {
    if(props.locked){
      setOpenDialog(true)
    } else {
      props.setLocked(true)
    }
  }

  return (
    <RestrictedAccess explicit={false}>
      <Tooltip title={props.locked ? "Unlock for editing" : "Lock editing"}>
        <Fab sx={{position: 'absolute', top: 10, right: 10}} color={props.locked ? "success" : "error"} aria-label="unlock" onClick={handleLockUnlock}>
          {props.locked ? <LockOutlineIcon/> : <LockOpenIcon/>}
        </Fab>
      </Tooltip>
      <Dialog   
        open={openDialog}
        slots={{
          transition: TransitionUp,
        }}
        keepMounted
        onClose={()=>setOpenDialog(false)}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{`Hey ${props.userFirstName ?? "there"}, are you sure you want to edit this?!`}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Once this is edited it will become visible to the public.
          </DialogContentText>
          <DialogContentText id="alert-dialog-slide-description">
            Are you sure you want to continue?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={()=>{setOpenDialog(false); props.setLocked(true)}}>Cancel</Button>
          <Button variant="contained" onClick={()=>{setOpenDialog(false); props.setLocked(false)}}>Continue</Button>
        </DialogActions>
      </Dialog>
    </RestrictedAccess>
  )
}