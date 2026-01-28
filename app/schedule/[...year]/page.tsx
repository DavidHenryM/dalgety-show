"use client"

import Content from "@components/Content";
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import TimelineDot from '@mui/lab/TimelineDot';
import { Divider, Grid, Link, Typography } from "@mui/material";
import { use, useState } from "react";
import { useSchedule } from "@/app/lib/queryHooks";
import Waiting from "@/app/components/Waiting";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconName } from '@fortawesome/fontawesome-common-types';
import { fas } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'
import EditLock from "@/app/components/EditLock";
import { authClient } from "@/app/lib/auth-client";
import { ActivitiesTable } from "@/app/components/ActivitiesTable";
import RestrictedAccess from "@/app/components/Restricted";
library.add(fas)


export default function ScheduleYear({params}: {params: Promise<{ year: string }>}){
  const { year } = use(params)
  const [schedule, activities, loading] = useSchedule(Number(year))
  const [locked, setLocked] = useState<boolean>(true)
  const session = authClient.useSession()

  return (
    <Content backgroundImageIndex={1}>
      <Grid sx={{minWidth: 500}}>
      <Waiting message={"loading schedule"} open={loading} />
      <Typography variant="h2" color="primary.main" justifySelf={"center"}>Program</Typography>
      <Typography variant="h5" color="primary.main" justifySelf={"center"}>OF EVENTS & ATTRACTIONS</Typography>
      <Typography variant="h5" color="primary.main" justifySelf={"center"}>{year}</Typography>
      <EditLock locked={locked} setLocked={setLocked} userFirstName={session.data?.user.name}/>
      <Divider sx={{mb: 2}}/>

      {(!loading && locked && (activities.length == 0 || schedule?.released == null || schedule.released > new Date())) ? 
        <>
          <Typography variant="body1" color="primary.main" justifySelf={"center"}>The schedule has not been released just yet. Check out the previous year&apos;s schedule below...</Typography>
          <Link href={`/schedule/${Number(year)-1}`}><Typography variant="h6" color="primary.main" justifySelf={"center"}>Go to {Number(year)-1} Schedule</Typography></Link>
        </> : <></>}
      <Timeline sx={{
        [`& .MuiTimelineItem-root:before`]: {
          flex: 0,
          padding: 0,
        },
      }}>
        {!loading && !locked ? 
        <>
          <RestrictedAccess explicit={false}>
            <ActivitiesTable title="Activities" showYear={Number(year)} />
          </RestrictedAccess>
        </> : <></>}
      { activities.map((activity, index, array)=>{
        
        const iconName: IconName = "fa-solid fa-" + activity.icon as IconName
        return (
          <TimelineItem key={`timelineItem${index}`}>
            <TimelineOppositeContent sx={{ mt: "7px" }}>{activity.time.getHours().toString().padStart(2, '0') + ":" + activity.time.getMinutes().toString().padStart(2, '0')}</TimelineOppositeContent>
            <TimelineSeparator>
              <Link href={activity.link??undefined}>
              <TimelineDot color="primary">
                <FontAwesomeIcon icon={iconName} color='#fbfcfb'/>
              </TimelineDot>
              </Link>
              {index == array.length -1 ? <></> :
              <TimelineConnector />
      }
            </TimelineSeparator>
            <TimelineContent sx={{ mt: "7px" }}>{activity.name}</TimelineContent>
          </TimelineItem>
        )
      })}
      </Timeline>
      </Grid>
    </Content>
  )
}





