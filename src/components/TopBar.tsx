import { AppBar, IconButton, Toolbar, Tooltip, Typography } from "@mui/material";
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import { drawerWidth } from "../styles/settings";
import type { Dispatch } from "react";

export function TopBar(props: {title: string, darkModeActive: boolean, setDarkModeActive: Dispatch<React.SetStateAction<boolean>>}){
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
      <Toolbar >
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