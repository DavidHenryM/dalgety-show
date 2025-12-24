import { navigation } from "../data/navigation";
import { AppBar, Container, Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, Toolbar, Tooltip, Typography} from "@mui/material";
import type { Dispatch } from "react";
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import logo from '../assets/images/Dalgety Show V2.png'
import { CountDownCard } from "./CountDownCard";
import { getNextShowDate } from "../utils";

export default function Navbar(props: {drawerWidth: number, mobile: boolean, darkModeActive: boolean, setDarkModeActive: Dispatch<React.SetStateAction<boolean>>}) {
  const drawerWidth = props.drawerWidth
  return (
    <>
    <AppBar component="nav" position="static" sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}>
      <Toolbar >
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
        >
          The Dalgety Show
        </Typography>
        <Tooltip title="Click to see change theme">
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
    <Drawer
        sx={{
          width: drawerWidth,
          display: 'flex', flexDirection: 'column',
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        slotProps={{paper: {
          sx: {
            backgroundColor: "secondary.main", // Or any custom hex/color
            color: "primary.main",               // Sets text color
          }
        }}}
        variant="permanent"
        anchor="left"
      >
        <Divider />
        <img src={logo}/>
        <List>
          {navigation.map((nav) => (
            <ListItem key={nav.label} disablePadding>
              <ListItemButton href={nav.path}>
                <ListItemIcon>
                  <nav.Icon/>
                </ListItemIcon>
                {props.mobile ? <></>:
                <Typography variant="h6">
                  {nav.label}
                </Typography>}
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <Container sx={{alignItems: "flex-end", marginTop: 'auto', marginBottom: 2}}>
          <CountDownCard countDownTo={getNextShowDate()} mobileActive={props.mobile}/>
        </Container>
      </Drawer>
    </>
  )
}

