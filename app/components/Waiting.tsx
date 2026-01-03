import { Backdrop, Box, Typography, } from '@mui/material';
import logo from '../images/dalgety-show-logo.png'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHorse } from "@fortawesome/free-solid-svg-icons"


export default function Waiting(props:{message: string, open: boolean}){
  return (

    <Backdrop
      sx={(theme) => ({ 
        color: '#fff', 
        zIndex: theme.zIndex.drawer + 1 
      })}
      open={props.open}
      >
    <Box
      sx={{
        position: 'fixed',    // Stays in place relative to the viewport
        top: '50%',           // Moves top edge to the vertical center
        left: '50%',          // Moves left edge to the horizontal center
        transform: 'translate(-50%, -50%)', // Offsets the box by its own height/width to perfectly center it
        zIndex: (theme) => theme.zIndex.modal, // Uses MUI's theme-defined high z-index (default 1300)
        backgroundColor: 'background.paper',
        boxShadow: 24,
        p: 4,
        justifyItems: "center",
        alignItems: "center"
      }}
    >
      {/* <Stack justifyContent={"center"} justifySelf={"center"} > */}

        <Image src={logo} alt={props.message} width={300}/>
        <Box>
        <FontAwesomeIcon color="#28719f" size={"xl"} icon={faHorse} bounce/>
        </Box>
        <Typography variant='h5' color="primary">{props.message}</Typography>
        
      {/* </Stack> */}
    </Box>
    </Backdrop>
  )
}