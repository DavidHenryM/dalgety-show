import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHorse } from "@fortawesome/free-solid-svg-icons"
import { Paper, Typography } from '@mui/material'



export default function Loading(){
  return (
    <Paper sx={{width: "200px", height: "300px"}}>
      <FontAwesomeIcon icon={faHorse} bounce />
      <Typography variant='h4'>Loading...</Typography>
    </Paper>
  )
}