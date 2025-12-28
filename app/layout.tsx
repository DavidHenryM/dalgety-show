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
import { SessionProvider } from "next-auth/react"


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
    <html lang="en">
      <body className={`${arvo.variable} antialiased`}>
        <AppRouterCacheProvider>
          <SessionProvider>
            <ThemeProvider theme={theme}>      
              <TopBar title={`${contentString} | The Dalgety Show`} darkModeActive={darkModeActive} setDarkModeActive={setDarkModeActive} drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen}/>
              <Navbar drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} setDarkModeActive={setDarkModeActive} darkModeActive={darkModeActive} setContentString={setContentString}/>
                {children}
              <Footer />
            </ThemeProvider>
          </SessionProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
