import { Divider, Paper, Tooltip, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { dateDiffInDays, getDateString } from "../utils";

export function CountDownCard(props: {countDownTo: Date, mobileActive: boolean}){
  const [daysRemaining, setDaysRemaining] = useState<number>()
  
  useEffect(()=>{
    const today = new Date()
    setDaysRemaining(dateDiffInDays(today, props.countDownTo))
  },[])

  if (props.mobileActive){
    return (
      <Tooltip title={`${daysRemaining} days until the next show`}>
        <Typography justifySelf="center" variant="h4">{daysRemaining}</Typography>
      </Tooltip>
    )
  } else {
    return (
      <Paper elevation={5} sx={{p:2, bgcolor: "primary.main", color: "secondary.main"}}>
        <Typography justifySelf="center" variant="h1">{daysRemaining}</Typography>
        <Typography justifySelf="center" variant="h6">days to show day!</Typography>
        <Divider sx={{p: 2}}/>
        <Typography sx={{p: 2}} variant="h6">{getDateString(props.countDownTo)}</Typography>
      </Paper>
    )
  }
}

