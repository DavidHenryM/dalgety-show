'use client'

import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter'
import { Arvo } from 'next/font/google'
import "./globals.css";
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { Theme, ThemeProvider } from "@mui/material";
import { useEffect, useState } from "react";
import { darkTheme, lightTheme } from "./theme";
import { TopBar } from './components/TopBar';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const arvo = Arvo({
  variable: "--font-arvo",
  subsets: ["latin"],
  weight: '400'
})


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [theme, setTheme] = useState<Theme>(lightTheme)
  const [darkModeActive, setDarkModeActive] = useState<boolean>(false)
  const [drawerOpen, setDrawerOpen] = useState(true)

  
  useEffect(()=>{
    async function getPrefersColorScheme(){
      if(darkModeActive){
        setTheme(darkTheme)
      } else {
        setTheme(lightTheme)
      }
    }
    getPrefersColorScheme()
  },[darkModeActive])
  

  return (
    <html lang="en">
      <body className={`${arvo.variable} antialiased`}>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>      
            <TopBar darkModeActive={darkModeActive} setDarkModeActiveAction={setDarkModeActive} drawerOpen={drawerOpen} setDrawerOpenAction={setDrawerOpen}/>
            <Navbar drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} setDarkModeActive={setDarkModeActive} darkModeActive={darkModeActive}/>
              {children}
            <Footer />
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
