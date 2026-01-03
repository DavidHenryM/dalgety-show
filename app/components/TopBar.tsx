'use client'

import { AppBar, Box, Breadcrumbs, IconButton, Link, Toolbar, Tooltip, Typography, useMediaQuery, useTheme } from "@mui/material";
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import MenuIcon from '@mui/icons-material/Menu';
import { drawerWidth } from "../settings";
import { useEffect, useState, type Dispatch } from "react";
import UserAvatar from "./UserAvatar";
import { usePathname } from 'next/navigation'

export function TopBar(
  props: {
    darkModeActive: boolean, 
    setDarkModeActive: Dispatch<React.SetStateAction<boolean>>, 
    drawerOpen: boolean, 
    setDrawerOpen: Dispatch<React.SetStateAction<boolean>>
  })
{
  const pathname = usePathname()
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [paths, setPaths] = useState<string[]>([])
  useEffect(()=>{
    if (pathname == "/"){
      setPaths(["/HOME"])
    } else {
      setPaths(pathname.split("/"))
    }


  },[pathname])

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
          The Dalgety Show 
        </Typography>
        <Breadcrumbs sx={{ '& ol': { justifyContent: 'left' }, color: "secondary.main", flexGrow: 1500 }}>
        {
        paths.map((directory, index, pathsArray)=>{
          return(
            <Link variant="h6" href={pathsArray.slice(0, index + 1).join('/')} color="secondary">{directory.replaceAll("/","").replaceAll("%20", " ").toLowerCase()}</Link>
          )
        })}
        </Breadcrumbs>
        
        
        {/* <SignupForm/> */}
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
        <UserAvatar/>
      </Toolbar>
    </AppBar>
  )
}