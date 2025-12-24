import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { galleryImages } from './assets/images/gallery/gallery';
import Home from "./pages/home/Home";
import About from "./pages/about/About";
import Events from "./pages/events/Events";
import Schedule from "./pages/schedule/Schedule";
import Gallery from "./pages/gallery/Gallery";
import Contact from "./pages/contact/Contact";
import Membership from "./pages/membership/Membership";
import { ThemeProvider } from "@emotion/react";
import { useEffect, useState } from "react";
import type { Theme } from "@mui/material";
import { lightTheme, darkTheme } from "./styles/theme";
import { useWindowSize } from "./hooks";

const App: React.FC = () => {
  const [theme, setTheme] = useState<Theme>(lightTheme)
  const [darkModeActive, setDarkModeActive] = useState<boolean>(false)
  const [sideBarWidth, setSideBarWidth] = useState<number>(240)
  const [mobileActive, setMobileActive] = useState<boolean>(false)

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
        <Navbar drawerWidth={sideBarWidth} mobile={mobileActive} setDarkModeActive={setDarkModeActive} darkModeActive={darkModeActive}/>
        <Routes>
          <Route path="/" element={<Home sideBarWidth={sideBarWidth}/>} />
          <Route path="/about" element={<About sideBarWidth={sideBarWidth}/>} />
          <Route path="/events" element={<Events sideBarWidth={sideBarWidth}/>} />
          <Route path="/schedule" element={<Schedule sideBarWidth={sideBarWidth}/>} />
          <Route path="/gallery" element={<Gallery images={galleryImages} sideBarWidth={sideBarWidth}/>} />
          <Route path="/contact" element={<Contact sideBarWidth={sideBarWidth}/>} />
          <Route path="/membership" element={<Membership sideBarWidth={sideBarWidth}/>} />
        </Routes>
        <Footer />
      </ThemeProvider>
    </>
  );
};

export default App;
