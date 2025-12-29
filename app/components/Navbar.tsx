import { adminNavigation, navigation } from "../data/navigation";
import { Box, Container, Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, Tooltip, Typography, useMediaQuery, useTheme} from "@mui/material";
import { useEffect, useState, type Dispatch } from "react";
import { CountDownCard } from "./CountDownCard";
import { getNextShowDate } from "../utils";
import { drawerWidth } from "../settings";
import CloseIcon from '@mui/icons-material/Close';
import logo from '../images/Dalgety Show V2.png'
import Image from 'next/image'
import Link from 'next/link'
import { useSession } from "next-auth/react";
import { getUserRole } from "../lib/queries";
import { Role } from "../generated/prisma/enums";
import { useUserRole } from "../lib/queryHooks";



export default function Navbar(props: {
  drawerOpen: boolean, 
  darkModeActive: boolean, 
  setDarkModeActive: Dispatch<React.SetStateAction<boolean>>, 
  setContentString: Dispatch<React.SetStateAction<string>>,
  setDrawerOpen: Dispatch<React.SetStateAction<boolean>>
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [role, loading] = useUserRole()


  function handleMenuClick(menuLabel: string){
    props.setContentString(menuLabel)
    if (isMobile){
      props.setDrawerOpen(false)
    }
  }

  return (
    <>
      <Drawer
        sx={{
          display: 'flex', flexDirection: 'column',
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: {
              xs: drawerWidth.xsDrawerOpen,
              sm: drawerWidth.smDrawerOpen, 
              md: drawerWidth.md, 
              lg: drawerWidth.lg
            },
            boxSizing: 'border-box',
          },
        }}
        slotProps={{paper: {
          sx: {
            backgroundColor: "secondary.main", // Or any custom hex/color
            color: "primary.main",               // Sets text color
            scrollbarWidth: 'none',
          }
        }}}
        variant="persistent"
        anchor="left"
        open={props.drawerOpen}
      >
      {/* This Box grows to fill all available space, pushing the icon to the far right */}
    <Box sx={{ flexGrow: 1, position: 'absolute', 
      top: 0, 
      left: `${Number(drawerWidth.smDrawerOpen.slice(0, -2)) - 45}px`, 
      zIndex: 1}}>
        { 
          isMobile ? 
            <IconButton color="inherit" onClick={()=>props.setDrawerOpen(false)}>
              <CloseIcon />
            </IconButton>
          : <></>
        }
    </Box>
      <Image src={logo} alt="Dalgety Show"/>
        <List>
          {navigation.map((nav) => (
            <ListItem key={nav.label} disablePadding>
              <Tooltip title={nav.label}>
                <Link href={`/${nav.label.toLocaleLowerCase()}`}>
                <ListItemButton onClick={()=>(handleMenuClick(nav.label))}>
                  <ListItemIcon>
                    <nav.Icon/>
                  </ListItemIcon>
                  <Typography variant="h6">
                    {nav.label}
                  </Typography>
                </ListItemButton>
                </Link>
              </Tooltip>
            </ListItem>
          ))}
        </List>
        <Divider/>
        {
          role === "SITE_ADMIN" ?
        <List>
          {adminNavigation.map((nav) => (
            <ListItem key={nav.label} disablePadding>
              <Tooltip title={nav.label}>
                <Link href={`/${nav.label.toLocaleLowerCase()}`}>
                <ListItemButton onClick={()=>(handleMenuClick(nav.label))}>
                  <ListItemIcon>
                    <nav.Icon/>
                  </ListItemIcon>
                  <Typography variant="h6">
                    {nav.label}
                  </Typography>
                </ListItemButton>
                </Link>
              </Tooltip>
            </ListItem>
          ))}
        </List>
        : <></>}
        <Divider />
        <Container sx={{alignItems: "flex-end", marginTop: 'auto', marginBottom: 2}}>
          <CountDownCard countDownTo={getNextShowDate()}/>
        </Container>
      </Drawer>
    </>
  )
}



