"use client"

import Content from "@components/Content";
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import TimelineDot from '@mui/lab/TimelineDot';
import { Link, Typography } from "@mui/material";
import { use } from "react";
import { useSchedule } from "@/app/lib/queryHooks";
import Waiting from "@/app/components/Waiting";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconName } from '@fortawesome/fontawesome-common-types';
import { fas } from '@fortawesome/free-solid-svg-icons'

import { library, icon } from '@fortawesome/fontawesome-svg-core'
library.add(fas)


export default function ScheduleYear({params}: {params: Promise<{ year: string }>}){
  const { year } = use(params)
  const [schedule, activities, loading] = useSchedule(Number(year))

  return (
    <Content backgroundImageIndex={1}>
      <Waiting message={"loading schedule"} open={loading} />
      <Typography variant="h2" color="primary.main" justifySelf={"center"}>Program</Typography>
      <Typography variant="h5" color="primary.main" justifySelf={"center"}>OF EVENTS & ATTRACTIONS</Typography>
      <Timeline sx={{
        [`& .MuiTimelineItem-root:before`]: {
          flex: 0,
          padding: 0,
        },
      }}>
      { activities.map((activity, index, array)=>{
        
        const iconName: IconName = "fa-solid fa-" + activity.icon as IconName
        const thisIcon = icon(iconName)
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
    </Content>
  )
}





