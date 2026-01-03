import { Grid, Typography } from "@mui/material";
import { Background } from "./Background";
import { backgroundImages } from "../images/backgrounds";
import { drawerWidth, footerHeight } from "../settings";

export default function UnAuthorised(){
  return (
        <>
          <Background image={backgroundImages[2]} />
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
      <Typography variant="h2">You are not authorised to view this page</Typography>
    </Grid>
    </>
  )
}