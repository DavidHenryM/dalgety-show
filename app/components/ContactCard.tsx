import { Avatar,  Link, Paper, Stack, Typography } from "@mui/material";
import EmailIcon from '@mui/icons-material/Email';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import { User } from "../generated/prisma/browser";


const ContactCard = (props: { contact: User }) => {
  console.log(props.contact);
  return (
    <Paper elevation={8} sx={{p:2, backgroundColor: "secondary.main", color: "primary.main"}} >
      <Stack direction="column" spacing={2}>
        <Typography variant={"h5"}>
          {props.contact.officialRole}
        </Typography>
        <Stack direction={"row"} sx={{alignContent: "center", paddingLeft: 1}}>     
          <Avatar src={props.contact.image ? props.contact.image : "../images/woman-farmer.png"}/>
          <Typography alignContent={"center"} sx={{paddingLeft: 2}}>{`${props.contact.name}`}</Typography>
        </Stack>
        {props.contact.mobileNumber || props.contact.landlineNumber ? 
        <Stack direction={"row"} sx={{alignContent: "center", paddingLeft: 2}}>
          <SmartphoneIcon/>
          <Typography alignContent={"center"} sx={{paddingLeft: 3}}>{props.contact.mobileNumber ?? props.contact.landlineNumber}</Typography>
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
