import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { galleryImages } from './assets/images/gallery/gallery';
import Home from "./pages/Home";
import About from "./pages/About";
import Events from "./pages/Events";
import Schedule from "./pages/Schedule";
import Gallery from "./pages/Gallery";
import Contact from "./pages/Contact";
import Membership from "./pages/Membership";
import { ThemeProvider } from "@emotion/react";
import { useEffect, useState } from "react";
import type { Theme } from "@mui/material";
import { lightTheme, darkTheme } from "./styles/theme";

const App: React.FC = () => {
  const [theme, setTheme] = useState<Theme>(lightTheme)
  const [darkModeActive, setDarkModeActive] = useState<boolean>(false)

  useEffect(()=>{
    if(darkModeActive){
      setTheme(darkTheme)
    } else {
      setTheme(lightTheme)
    }
  },[darkModeActive])

  const sideBarWidth = 240

  return (
    <>
      <ThemeProvider theme={theme}>
        <Navbar drawerWidth={sideBarWidth} setDarkModeActive={setDarkModeActive} darkModeActive={darkModeActive}/>
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
