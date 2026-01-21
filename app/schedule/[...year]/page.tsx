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

  // const timeline = [
  //   {time: "7:00 am", event: "Yard dog trials commence", Icon: FaDog, link: "/events/2026/Yard Dogs"},
  //   {time: "8:30 am", event: "Quilt exhibition in Dalgety Memorial Hall opens", Icon: FaDoorOpen},
  //   {time: "8:30 am", event: "Horse ring events commence", Icon: FaHorse},
  //   {time: "9:00 am", event: "Showground pavilion opens", Icon: FaDoorOpen},
  //   {time: "9:00 am", event: "Whip cracking demonstration", Icon: FaExplosion},
  //   {time: "9:30 am", event: "Whip cracking workshop", Icon: FaExplosion},
  //   {time: "9:30 am", event: "Sheep judging commences", Icon: FaGavel},
  //   {time: "9:30 am", event: "Judging in Pavilion commences (Pavilion will be closed for 1.5 hours", Icon: FaGavel},
  //   {time: "10:00 am", event: "Cattle, wool & poultry judging commences", Icon: FaHatCowboy},
  //   {time: "10:00 am", event: "Judging in Dalgety Memorial Hall commences", Icon: FaGavel},
  //   {time: "11:00 am", event: "Judging of novelty section commences", Icon: FaGavel},
  //   {time: "11:00 am", event: "Platypus plunge", Icon: FaBridgeWater},
  //   {time: "11:00 am", event: "Pavillion re-opens", Icon: FaDoorOpen},
  //   {time: "11:00 am", event: "Wood chop commences", Icon: FaTree, link: "/events/2026/Wood Chop"},
  //   {time: "1:00 pm", event: "Official show opening", Icon: FaChampagneGlasses},
  //   {time: "3:00 pm", event: "Whip cracking demonstration", Icon: FaExplosion},
  //   {time: "3:30 pm", event: "Whip cracking workshop", Icon: FaExplosion},
  // ]

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
            <TimelineOppositeContent sx={{ mt: "7px" }}>{activity.time.getHours()+":"+activity.time.getMinutes()}</TimelineOppositeContent>
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
            <TimelineContent sx={{ mt: "7px" }}>{activity.description}</TimelineContent>
          </TimelineItem>
        )
      })}
      </Timeline>
    </Content>
  )
}





