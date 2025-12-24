// import { Routes, Route } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { galleryImages } from '../../assets/images/gallery/gallery';
import Home from "../home/Home";
import About from "../about/About";
import Events from "../events/Events";
import Schedule from "../schedule/Schedule";
import Gallery from "../gallery/Gallery";
import Contact from "../contact/Contact";
import Membership from "../membership/Membership";
import { ThemeProvider } from "@emotion/react";
import { useEffect, useState } from "react";
import type { Theme } from "@mui/material";
import { lightTheme, darkTheme } from "../../styles/theme";
import { useWindowSize } from "../../hooks";

const App: React.FC = () => {
  const [theme, setTheme] = useState<Theme>(lightTheme)
  const [darkModeActive, setDarkModeActive] = useState<boolean>(false)
  const [sideBarWidth, setSideBarWidth] = useState<number>(240)
  const [mobileActive, setMobileActive] = useState<boolean>(false)
  const [contentString, setContentString] = useState<string>("HOME")


  const windowSize = useWindowSize()

  useEffect(()=>{
    if(windowSize.width >= 800){
      setSideBarWidth(240)
      setMobileActive(false)
    } else {
      setSideBarWidth(50)
      setMobileActive(true)
    }
  },[windowSize])

  useEffect(()=>{
    if(darkModeActive){
      setTheme(darkTheme)
    } else {
      setTheme(lightTheme)
    }
  },[darkModeActive])


  return (
    <>
      <ThemeProvider theme={theme}>
        <Navbar drawerWidth={sideBarWidth} mobile={mobileActive} setDarkModeActive={setDarkModeActive} darkModeActive={darkModeActive} setContentString={setContentString}/>
        { 
          contentString == "HOME" ? <Home sideBarWidth={sideBarWidth}/> : 
          contentString == "ABOUT" ? <About sideBarWidth={sideBarWidth}/> :
          contentString == "EVENTS" ? <Events sideBarWidth={sideBarWidth}/> :
          contentString == "SCHEDULE" ? <Schedule sideBarWidth={sideBarWidth}/> :
          contentString == "GALLERY" ? <Gallery sideBarWidth={sideBarWidth} images={galleryImages}/> :
          contentString == "CONTACT" ? <Contact sideBarWidth={sideBarWidth}/> :
          contentString == "MEMBERSHIP" ? <Membership sideBarWidth={sideBarWidth}/> :
          <Home sideBarWidth={sideBarWidth}/>
        }
        <Footer />
      </ThemeProvider>
    </>
  );
};

export default App;
