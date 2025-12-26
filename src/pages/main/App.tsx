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
import { TopBar } from "../../components/TopBar";

const App: React.FC = () => {
  const [theme, setTheme] = useState<Theme>(lightTheme)
  const [darkModeActive, setDarkModeActive] = useState<boolean>(false)
  const [contentString, setContentString] = useState<string>("HOME")
  const [drawerOpen, setDrawerOpen] = useState(true)

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
        <TopBar title={contentString} darkModeActive={darkModeActive} setDarkModeActive={setDarkModeActive} drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen}/>
        <Navbar drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} setDarkModeActive={setDarkModeActive} darkModeActive={darkModeActive} setContentString={setContentString}/>
        { 
          contentString == "HOME" ? <Home/> : 
          contentString == "ABOUT" ? <About/> :
          contentString == "EVENTS" ? <Events/> :
          contentString == "SCHEDULE" ? <Schedule/> :
          contentString == "GALLERY" ? <Gallery images={galleryImages}/> :
          contentString == "CONTACT" ? <Contact/> :
          contentString == "MEMBERSHIP" ? <Membership/> :
          <Home/>
        }
        <Footer />
      </ThemeProvider>
    </>
  );
};

export default App;
