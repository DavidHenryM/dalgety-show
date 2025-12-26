import { AppBar, IconButton, Toolbar, Tooltip, Typography, useMediaQuery, useTheme } from "@mui/material";
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import MenuIcon from '@mui/icons-material/Menu';
import { drawerWidth } from "../styles/settings";
import { useEffect, type Dispatch } from "react";

export function TopBar(
  props: {
    title: string, 
    darkModeActive: boolean, 
    setDarkModeActive: Dispatch<React.SetStateAction<boolean>>, 
    drawerOpen: boolean, 
    setDrawerOpen: Dispatch<React.SetStateAction<boolean>>
  })
{
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(()=>{
    if(!isMobile){
      props.setDrawerOpen(true)
    }
  },[isMobile])
  return (
    <AppBar 
      component="nav" 
      position="static" 
      sx={{ 
        width: {
          sm: `calc(100% - ${drawerWidth.sm})`,
          md: `calc(100% - ${drawerWidth.md})`,
          lg: `calc(100% - ${drawerWidth.lg})`,
        }, 
        ml: {
          sm: drawerWidth.sm, 
          md: drawerWidth.md, 
          lg: drawerWidth.lg
          }
      }}>
      <Toolbar>
        {isMobile ? 
        <IconButton onClick={()=>(props.setDrawerOpen(!props.drawerOpen))}>  
          <MenuIcon/>
        </IconButton> 
        : <></>}
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1 }}
          color="secondary"
        >
          {props.title}
        </Typography>
        <Tooltip title={props.darkModeActive ? "Change to Light Mode" : "Change to Dark Mode"}>
          {
            props.darkModeActive ?
              <IconButton onClick={() => props.setDarkModeActive(false)}>
                <LightModeIcon />
              </IconButton>
              :
              <IconButton onClick={() => props.setDarkModeActive(true)}>
                <DarkModeIcon />
              </IconButton>
          }
        </Tooltip>
      </Toolbar>
    </AppBar>
  )
}