'use client'

import { Button, Link, Typography } from "@mui/material";
import Content from "../components/Content"

export default function Membership(){
  return (
    <Content backgroundImageIndex={0} >
      <Typography variant="h4" justifySelf={"center"} color="primary">Become a Member</Typography>
      <Typography>The Dalgety Show Society Inc. is a devoted group of people who feel strongly about the future of rural Australia and understand the importance of local Shows.</Typography>
      <Typography> Every year the committee organises for the Dalgety Show, new and exciting events to keep the show fresh and appealing to not only the residents of the Snowy River Shire but visitors to the Snowy Mountains and the Monaro.</Typography>
      <Typography> The Dalgety Show Society Inc. welcomes new members. Membership costs just $10 per person or $20 per family.</Typography>
      <Link href="/membership/apply">
        <Button variant="contained">Apply</Button>
      </Link>
    </Content>
  )
}