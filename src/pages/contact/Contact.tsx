import { Container, Grid, Typography } from "@mui/material";
import ContactCard from "../../components/ContactCard";
import { contacts } from "../../data/contacts"
import { Background } from "../../components/Background";
import cow1 from "../../assets/images/gallery/Cow_1.jpg"
import { drawerWidth, footerHeight } from "../../styles/settings";

export default function Contact(){
  return (

    <Container 
      sx={{
        ml: {
          sm: drawerWidth.sm,
          md: drawerWidth.md,
          lg: drawerWidth.lg
        },
        mb: footerHeight
      }}
    >
      <Background image={cow1}/>
      <Typography variant="h3" justifySelf={"center"} sx={{p:2}}>Contact</Typography>
      <Grid container spacing={1}>
          { 
            contacts.map((contact, index)=>{
              return (
                <Grid sx={{p: {sm: 0, md:2}}} size={{sm: 12, md:6, lg:4}}>
                  <ContactCard key={index} contact={contact}/>
                </Grid>
            )
            }
          )}
      </Grid>
      </Container>

  );
};