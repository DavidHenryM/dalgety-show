import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHorse } from "@fortawesome/free-solid-svg-icons"
import { Grid, Paper, Stack, Typography } from '@mui/material'



export default function Loading(){
  return (
    <Grid container 
      display="flex" 
      justifyContent="center" 
      alignItems="center" 
      minHeight="200vh"
      size={12}
    >
    <Paper>
      <Stack direction="column" justifyContent={"center"} alignItems="center" >
        <FontAwesomeIcon color="primary.main" size={"2xl"} icon={faHorse} bounce />
        <Typography color="primary" variant='h6'>Loading...</Typography>

      </Stack>
    </Paper>
    </Grid>
  )
}