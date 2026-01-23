import { Background } from "@/app/components/Background";
import { backgroundImages } from "@/app/images/backgrounds";
import { drawerWidth, footerHeight } from "@/app/settings";
import { Grid, Paper } from "@mui/material";
import { ReactNode } from 'react';

interface ContentProps {
  children: ReactNode;
  backgroundImageIndex: number
}

export default function Content({children, backgroundImageIndex}: ContentProps){
  return (
    <>
      <Background image={backgroundImages[backgroundImageIndex]} />
      <Grid 
        container 
        spacing={2} 
        sx={{
          p: {
            sm: 1, 
            md: 2, 
            lg: 10
          }, 
          ml: {
            sm: drawerWidth.sm,
            md: drawerWidth.md,
            lg: drawerWidth.lg
          },
          mb: footerHeight
        }}
      >
        <Grid size={{md:12, lg:12}} spacing={2} p={2} sx={{justifySelf:"center"}}>
          <Paper sx={{p:2, backgroundColor: "secondary.main", justifySelf:"center", position: 'relative'}}>
            {children}
          </Paper>
        </Grid>
      </Grid>
    </>
)
}