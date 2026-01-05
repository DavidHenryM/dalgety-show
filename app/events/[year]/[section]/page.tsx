'use client'

import { Background } from '@/app/components/Background'
import { EventSection, Show, Prize } from '@/app/generated/prisma/client'
import { backgroundImages } from '@/app/images/backgrounds'
import { getEventSectionByName, getSectionEventsAndPrizes, getShow } from '@/app/lib/queries'
import { drawerWidth, footerHeight } from '@/app/settings'
import { getDateString } from '@/app/utils'
import { Card, CardContent, CardMedia, Divider, Grid, Paper, Stack, Typography } from '@mui/material'
import { use, useEffect, useState } from 'react'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import Waiting from '@/app/components/Waiting'
 
export default function EventDetails({params}: {params: Promise<{ year: string, section: string }>}) {
  const path = use(params)
  const showYear = Number(path.year)
  const sectionName = path.section.replaceAll("%20", " ")
  const [loading, setLoading] = useState(true)
  const [events, setEvents] = useState<any[]>([])
  const [show, setShow] = useState<Show>()
  const [eventSection, setEventSection] = useState<EventSection>()

  useEffect(()=>{
    setLoading(true)
    getShow(showYear).then((show)=>{
      if (show){
        setShow(show)
        getEventSectionByName(sectionName, show.id).then((thisEventSection)=>{
          console.log(thisEventSection)
          if (thisEventSection){
            setEventSection(thisEventSection)
            getSectionEventsAndPrizes(thisEventSection.id).then((theseEvents)=>{
              setEvents(theseEvents)
              console.log(theseEvents)
            }).finally(()=>setLoading(false))
          } 
        })
      } 
    })
  },[])

  return (
    <>
      <Waiting message={`Loading ${sectionName} events...`} open={loading}/>
      <Background image={backgroundImages[1]} />
      <Grid 
        container 
        spacing={2} 
        sx={{
          p: {
            sm: 1, 
            md: 2, 
            lg: 10
          }, 
          ml: {
            sm: drawerWidth.sm,
            md: drawerWidth.md,
            lg: drawerWidth.lg
          },
          mb: footerHeight
        }}
      >
        <Grid size={12}>
          <Paper sx={{p:2, backgroundColor: "secondary.main"}}>
      {
        eventSection?.letter ? 
          <Typography variant="h5" color="primary.main">{`Section ${eventSection.letter} ${eventSection.name}`}</Typography> :
          <Typography variant="h5" color="primary.main">{eventSection?.name}</Typography>
      }
      <Divider/>
        <Typography variant="subtitle1" color="primary.main">{eventSection?.details}</Typography>
        <Divider/>
        <Grid container sx={{p:2}} spacing={5}>
          {
            events.map((event, index)=>{
              return (
                <Grid size={{sm: 12, md: 6, lg: 6, xl: 4, xxl: 3 }} key={`events-${index}`}>
                  <Card sx={{ width: 345, backgroundColor: "secondary.main", color: "primary.main" }} elevation={8}>
                    <CardMedia
                      sx={{ height: 140 }}
                      image={event.image ? event.image : eventSection?.image}
                      title={event.name}
                    />
                    <CardContent>
                      <Typography id="alert-dialog-slide-description"variant="h6">{event.name}</Typography>
                      <Typography>{event.description}</Typography>
                        {
                          event.entryFee ? 
                          <Typography>{`Entry fee: $${event.entryFee?.toFixed(0)}`}</Typography> : <></>
                        }
                        {
                          event.entryFeeTeam ?
                          <Typography>{`Team entry fee: $${event.entryFeeTeam?.toFixed(0)}`}</Typography> : <></>
                        }
                        {
                          event.prizes.map((prize: Prize, index: number)=>{
                            return(
                              <Stack direction="row" key={`prize${index}`}>
                                <FormatedPrizeName key={`prize${index}`} name={prize.prizeName}/>
                                <Typography>{`: $${prize.cashPrizeValue}`}</Typography>
                              </Stack>
                            )
                          })
                        }
                    </CardContent>
                </Card>
                </Grid>
              )
            })
          }
          <Divider/>

          {eventSection?.entryInstructions?.split("\\n").map((line, index)=>{
            return (<Typography key={`line-${index}`} variant="subtitle2" color="primary.main">{line}</Typography>)
          })}
          { eventSection?.entryClose ?
            <Typography variant="subtitle2" color="primary.main">
              {`Entires close on ${getDateString(eventSection.entryClose)}`}
            </Typography> : <></>
          }
        </Grid>
        </Paper>
        </Grid>
      </Grid>
    </>
  )
}

function FormatedPrizeName(props: {name: string | null}){
  let color = "primary.main"
  if (props.name){
    if(props.name.startsWith("1st")){
      color = "gold"
    } else if (props.name.startsWith("2nd")){
      color = "silver"
    } else if (props.name.startsWith("3rd")){
      color = "chocolate"
    }
  }
  return (
    <Stack direction={"row"}>
      <EmojiEventsIcon sx={{color:{color}}}/>
      <Typography>{props.name}</Typography>
    </Stack>
  )
}

function getMailto(email: string, showYear: number, sectionName: string, eventName: string): string | undefined{
  const mailTo = `mailto:${email}`
  const subject = `subject=Dalgety Show ${showYear}: ${sectionName} section, ${eventName}  `
  const body = `Hi, I would like to register for the event as part of the ${sectionName} in the Dalgety Show in ${showYear}`
  const url = URL.parse(mailTo + "?" + subject + "&" + body)
  
  return url?.toString() 
}