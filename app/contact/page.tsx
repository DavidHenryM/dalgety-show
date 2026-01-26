import { Container, Grid, Typography } from "@mui/material";
import ContactCard from "../components/ContactCard";
import { Background } from "../components/Background";
import cow1 from '../images/gallery/Cow_1.jpg'
import { drawerWidth, footerHeight } from "../settings";
import { getOwnerOfficials } from "../lib/queries";
import type { Contact } from "../types";

function formatOfficialRole(role: string): string {
  return role
    .split("_")
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(" ");
}

export default async function Contact(){
  const officialUsers = await getOwnerOfficials();
  const contacts: Contact[] = officialUsers.map((user) => ({
    role: formatOfficialRole(user.officialRole),
    name: user.name,
    phone: user.mobileNumber ?? user.landlineNumber ?? undefined,
    email: user.email,
    avatarPath: user.image ?? undefined,
  }));

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
                <Grid key={index} sx={{p: {sm: 0, md:2}}} size={{sm: 12, md:6, lg:4}}>
                  <ContactCard key={index} contact={contact}/>
                </Grid>
            )
            }
          )}
      </Grid>
      </Container>

  );
};