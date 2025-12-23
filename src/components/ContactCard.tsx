import type { Contact } from "../types";
import womanFarmer from "../assets/images/woman-farmer.png"
import { Avatar,  Link, Paper, Stack, Typography } from "@mui/material";
import EmailIcon from '@mui/icons-material/Email';
import SmartphoneIcon from '@mui/icons-material/Smartphone';


const ContactCard = (props: { contact: Contact }) => {
  return (
    <Paper elevation={8} sx={{p:2, backgroundColor: "secondary.main", color: "primary.main"}} >
      <Stack direction="column" spacing={2}>
        <Typography variant={"h5"}>
          {props.contact.role}
        </Typography>
        <Stack direction={"row"} sx={{alignContent: "center", paddingLeft: 1}}>     
          <Avatar src={props.contact.avatarPath ? props.contact.avatarPath : womanFarmer}/>
          <Typography alignContent={"center"} sx={{paddingLeft: 2}}>{`${props.contact.name}`}</Typography>
        </Stack>
        {props.contact.phone? 
        <Stack direction={"row"} sx={{alignContent: "center", paddingLeft: 2}}>
          <SmartphoneIcon/>
          <Typography alignContent={"center"} sx={{paddingLeft: 3}}>{props.contact.phone}</Typography>
        </Stack>
        : <></>}
        <Stack direction={"row"} sx={{alignContent: "center", paddingLeft: 2}}>     
          <EmailIcon/>
          <Link alignContent={"center"} href={`mailto:${props.contact.email}`} sx={{paddingLeft: 3}}>{`${props.contact.email}`}</Link>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default ContactCard;
