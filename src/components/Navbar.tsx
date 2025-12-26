import { navigation } from "../data/navigation";
import { Container, Divider, Drawer, List, ListItem, ListItemButton, ListItemIcon, Tooltip, Typography} from "@mui/material";
import { useState, type Dispatch } from "react";
import logo from '../assets/images/Dalgety Show V2.png'
import { CountDownCard } from "./CountDownCard";
import { getNextShowDate } from "../utils";
import { drawerWidth } from "../styles/settings";

export default function Navbar(props: {
  windowMargins: {ml: number, mb: number} 
  mobile: boolean, 
  darkModeActive: boolean, 
  setDarkModeActive: Dispatch<React.SetStateAction<boolean>>, 
  setContentString: Dispatch<React.SetStateAction<string>>}) {
  const [drawerOpen, setDrawerOpen] = useState(true)
  return (
    <>
      <Drawer
        sx={{
          display: 'flex', flexDirection: 'column',
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: {
              sm: drawerWidth.sm, 
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
        open={drawerOpen}
      >
        <Divider />
        <img src={logo}/>
        <List>
          {navigation.map((nav) => (
            <ListItem key={nav.label} disablePadding>
              <Tooltip title={nav.label}>
                <ListItemButton onClick={()=>(props.setContentString(nav.label))}>
                  <ListItemIcon>
                    <nav.Icon/>
                  </ListItemIcon>
                    {props.mobile ? <></>:
                  <Typography variant="h6">
                    {nav.label}
                  </Typography>}
                </ListItemButton>
              </Tooltip>
            </ListItem>
          ))}
        </List>
        <Divider />
        <Container sx={{alignItems: "flex-end", marginTop: 'auto', marginBottom: 2}}>
          <CountDownCard countDownTo={getNextShowDate()}/>
        </Container>
      </Drawer>
    </>
  )
}



