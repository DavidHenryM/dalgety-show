import { Alert, AlertColor, AlertPropsColorOverrides, Button, Snackbar, SnackbarCloseReason,  } from "@mui/material";
import {OverridableStringUnion} from "@mui/types"
import { Dispatch, SetStateAction, SyntheticEvent, useState } from "react";
import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useRouter } from 'next/navigation';

export function AlertDialog(props: {
    title: string,
    message: string, 
    open: boolean, 
    setOpen: Dispatch<SetStateAction<boolean>>,
    redirect: string
  }) {
  const router = useRouter()
  
  const handleClose = () => {
    props.setOpen(false)
    if (props.redirect){
      router.push(props.redirect)
    }
  }

  return (
    <React.Fragment>
      <Dialog
        open={props.open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {props.title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {props.message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}


export function Snack(
  props: {
    message: string, 
    open: boolean, 
    setOpen: Dispatch<SetStateAction<boolean>>, 
    severity: OverridableStringUnion<AlertColor, AlertPropsColorOverrides> | undefined
  }
)
{
  const handleClose = (
    event?: SyntheticEvent | Event,
    reason?: SnackbarCloseReason,
  ) => {
    if (reason === 'clickaway') {
      return
    }
    props.setOpen(false);
  };

  return (
    <Snackbar open={props.open} autoHideDuration={6000} onClose={handleClose}>
      <Alert
        onClose={handleClose}
        severity="success"
        variant="filled"
        sx={{ width: '100%' }}
      >
        {props.message}
      </Alert>
    </Snackbar>
  );
}