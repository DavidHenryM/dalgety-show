import Content from "@components/Content";
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import TimelineDot from '@mui/lab/TimelineDot';
import { Link, Typography } from "@mui/material";
import { FaTree, FaExplosion, FaHorse, FaDog, FaGavel, FaHatCowboy, FaDoorOpen, FaBridgeWater, FaChampagneGlasses  } from "react-icons/fa6";
import { use } from "react";
import { useSchedule } from "@/app/lib/queryHooks";
import Waiting from "@/app/components/Waiting";

export default function ScheduleYear({params}: {params: Promise<{ year: string }>}){
  const { year } = use(params)

  const timeline = [
    {time: "7:00 am", event: "Yard dog trials commence", Icon: FaDog, link: "/events/2026/Yard Dogs"},
    {time: "8:30 am", event: "Quilt exhibition in Dalgety Memorial Hall opens", Icon: FaDoorOpen},
    {time: "8:30 am", event: "Horse ring events commence", Icon: FaHorse},
    {time: "9:00 am", event: "Showground pavilion opens", Icon: FaDoorOpen},
    {time: "9:00 am", event: "Whip cracking demonstration", Icon: FaExplosion},
    {time: "9:30 am", event: "Whip cracking workshop", Icon: FaExplosion},
    {time: "9:30 am", event: "Sheep judging commences", Icon: FaGavel},
    {time: "9:30 am", event: "Judging in Pavilion commences (Pavilion will be closed for 1.5 hours", Icon: FaGavel},
    {time: "10:00 am", event: "Cattle, wool & poultry judging commences", Icon: FaHatCowboy},
    {time: "10:00 am", event: "Judging in Dalgety Memorial Hall commences", Icon: FaGavel},
    {time: "11:00 am", event: "Judging of novelty section commences", Icon: FaGavel},
    {time: "11:00 am", event: "Platypus plunge", Icon: FaBridgeWater},
    {time: "11:00 am", event: "Pavillion re-opens", Icon: FaDoorOpen},
    {time: "11:00 am", event: "Wood chop commences", Icon: FaTree, link: "/events/2026/Wood Chop"},
    {time: "1:00 pm", event: "Official show opening", Icon: FaChampagneGlasses},
    {time: "3:00 pm", event: "Whip cracking demonstration", Icon: FaExplosion},
    {time: "3:30 pm", event: "Whip cracking workshop", Icon: FaExplosion},
  ]

  const [schedule, loading] =useSchedule(year)

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
      { schedule.map((attraction, index, array)=>{
        return (
          <TimelineItem key={`timelineItem${index}`}>
            <TimelineOppositeContent sx={{ mt: "7px" }}>{attraction.time}</TimelineOppositeContent>
            <TimelineSeparator>
              <Link href={attraction.link}>
              <TimelineDot color="primary">
                <attraction.Icon color='#fbfcfb'/>
              </TimelineDot>
              </Link>
              {index == array.length -1 ? <></> :
              <TimelineConnector />
      }
            </TimelineSeparator>
            <TimelineContent sx={{ mt: "7px" }}>{attraction.event}</TimelineContent>
          </TimelineItem>
        )
      })}
      </Timeline>
    </Content>
  )
}





