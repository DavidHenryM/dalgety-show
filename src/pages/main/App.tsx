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
import { TopBar } from "../../components/TopBar";

const App: React.FC = () => {
  const [theme, setTheme] = useState<Theme>(lightTheme)
  const [darkModeActive, setDarkModeActive] = useState<boolean>(false)
  const [windowMargins, setWidowMargins] = useState<{ml: number, mb: number}>({ml: 240, mb: 100})
  const [mobileActive, setMobileActive] = useState<boolean>(false)
  const [contentString, setContentString] = useState<string>("HOME")
  const windowSize = useWindowSize()

  useEffect(()=>{
    if(windowSize.width >= 800){
      setWidowMargins({ml: 240, mb: windowMargins.mb})
      setMobileActive(false)
    } else {
      setWidowMargins({ml: 50, mb: windowMargins.mb})
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
        <TopBar title={contentString} darkModeActive={darkModeActive} setDarkModeActive={setDarkModeActive}/>
        <Navbar windowMargins={windowMargins} mobile={mobileActive} setDarkModeActive={setDarkModeActive} darkModeActive={darkModeActive} setContentString={setContentString}/>
        { 
          contentString == "HOME" ? <Home windowMargins={windowMargins}/> : 
          contentString == "ABOUT" ? <About windowMargins={windowMargins}/> :
          contentString == "EVENTS" ? <Events windowMargins={windowMargins}/> :
          contentString == "SCHEDULE" ? <Schedule windowMargins={windowMargins}/> :
          contentString == "GALLERY" ? <Gallery windowMargins={windowMargins} images={galleryImages}/> :
          contentString == "CONTACT" ? <Contact windowMargins={windowMargins}/> :
          contentString == "MEMBERSHIP" ? <Membership windowMargins={windowMargins}/> :
          <Home windowMargins={windowMargins}/>
        }
        <Footer />
      </ThemeProvider>
    </>
  );
};

export default App;
