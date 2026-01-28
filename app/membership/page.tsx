'use client'

import { Button, Grid, Link, Typography } from "@mui/material";
import { useState } from "react";
import Content from "../components/Content"
import EditLock from "../components/EditLock";
import RestrictedAccess from "../components/Restricted";
import { MembershipPackagesTable } from "../components/MembershipPackagesTable";
import { authClient } from "../lib/auth-client";

export default function Membership(){
  const { data } = authClient.useSession()
  const [locked, setLocked] = useState(true)
  return (
    <Content backgroundImageIndex={0} >
      <EditLock locked={locked} setLocked={setLocked} userFirstName={data?.user.name}/>
      <Typography variant="h4" justifySelf={"center"} color="primary">Become a Member</Typography>
      <Typography>The Dalgety Show Society Inc. is a devoted group of people who feel strongly about the future of rural Australia and understand the importance of local Shows.</Typography>
      <Typography> Every year the committee organises for the Dalgety Show, new and exciting events to keep the show fresh and appealing to not only the residents of the Snowy River Shire but visitors to the Snowy Mountains and the Monaro.</Typography>
      <Typography> The Dalgety Show Society Inc. welcomes new members. Membership costs just $10 per person or $20 per family.</Typography>
      <Link href="/membership/apply">
        <Button variant="contained">Apply</Button>
      </Link>
      {!locked ? (
        <RestrictedAccess explicit={true}>
          <Grid sx={{ mt: 3 }}>
            <MembershipPackagesTable title="Membership Packages" />
          </Grid>
        </RestrictedAccess>
      ) : null}
    </Content>
  )
}