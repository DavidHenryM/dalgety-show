import { Typography } from "@mui/material";
import Content from "../components/Content";

export default function SignInError(){
  return (
    <Content backgroundImageIndex={2}>
      <Typography variant="h4" align="center" gutterBottom>
        Sign-in Error
      </Typography>
      <Typography variant="body1" align="center">
        There was an error during the sign-in process. Please try again.
      </Typography>
    </Content>  
  )
}