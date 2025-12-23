import { Container, Grid, Typography } from "@mui/material";
import ContactCard from "../../components/ContactCard";
import { contacts } from "../../data/contacts"
import { Background } from "../../components/Background";
import cow1 from "../../assets/images/gallery/Cow_1.jpg"

export default function Contact(props: {sideBarWidth: number}){
  return (

    <Container sx={{ml: `${props.sideBarWidth}px`}}>
      <Background image={cow1}/>
      <Typography variant="h3" justifySelf={"center"} sx={{p:2}}>Contact</Typography>
      <Grid container spacing={1}>
          { 
            contacts.map((contact, index)=>{
              return (
                <Grid sx={{p: 2}} size={4}>
                  <ContactCard key={index} contact={contact}/>
                </Grid>
            )
            }
          )}
      </Grid>
      </Container>

  );
};