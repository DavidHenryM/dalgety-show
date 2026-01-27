'use client'

import type { EventSection, Prize } from '@generated/browser'
import { getEventSectionByName, getLatestReleasedSchedule, getReleasedScheduleForShow, getSectionEventsAndPrizes, getShow, getUserRole } from '@lib/queries'
import { getDateString } from '@app/utils'
import { Card, CardContent, CardMedia, Divider, Grid, Stack, Typography } from '@mui/material'
import { use, useEffect, useState } from 'react'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import Waiting from '@/app/components/Waiting'
import EditLock from '@/app/components/EditLock'
import { authClient } from '@lib/auth-client'
import { EventsSectionTable } from '@/app/components/EventsSectionTable'
import RestrictedAccess from '@/app/components/Restricted'
import Content from '@/app/components/Content'
import { SectionEventandPrizes } from '@/app/types'
import { useRouter } from 'next/navigation'
 
export default function EventDetails({params}: {params: Promise<{ year: string, section: string }>}) {
  const path = use(params)
  const showYear = Number(path.year)
  const sectionName = path.section.replaceAll("%20", " ")
  const [loading, setLoading] = useState(true)
  const [events, setEvents] = useState<SectionEventandPrizes[]>([])
  const [eventSection, setEventSection] = useState<EventSection>()
  const [locked, setLocked] = useState<boolean>(true)
  const { data } = authClient.useSession()
  const router = useRouter()

  useEffect(()=>{
    async function fetchData(){
      setLoading(true)
      try{
        const show = await getShow(showYear)
        if (!show){
          return
        }
        const role = data?.user?.email ? await getUserRole(data.user.email) : null
        if (role !== 'SITE_ADMIN' && role !== 'OWNER'){
          const releasedSchedule = await getReleasedScheduleForShow(show.id)
          if (!releasedSchedule){
            const latestReleased = await getLatestReleasedSchedule()
            if (latestReleased){
              const targetSection = encodeURIComponent(sectionName)
              router.replace(`/events/${latestReleased.show.year}/${targetSection}`)
            }
            return
          }
        }
        const thisEventSection = await getEventSectionByName(sectionName, show.id)
        if (thisEventSection){
          setEventSection(thisEventSection)
          const theseEvents = await getSectionEventsAndPrizes(thisEventSection.id)
          setEvents(theseEvents)
        }
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  },[showYear, sectionName, router, data?.user?.email])

  return (
    <>
      <Waiting message={`Loading ${sectionName} events...`} open={loading}/>
      <Content backgroundImageIndex={1}>
           <EditLock locked={locked} setLocked={setLocked} userFirstName={data?.user.name}/>
      {
        eventSection?.letter ? 
          <Typography variant="h5" color="primary.main">{`Section ${eventSection.letter} ${eventSection.name}`}</Typography> :
          <Typography variant="h5" color="primary.main">{eventSection?.name}</Typography>
      }
      <Divider/>
        {!locked ? (
          <RestrictedAccess explicit={true}>
            <Grid sx={{ mt: 2 }}>
              <EventsSectionTable title="Section Events" showYear={showYear} sectionName={sectionName} />
            </Grid>
          </RestrictedAccess>
        ) : null}
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
                      image={event.image ? event.image : (eventSection?.image ? eventSection?.image : undefined)}
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
                        {event.results && event.results.length > 0 ? (
                          <>
                            <Divider sx={{ my: 1 }} />
                            <Typography variant="subtitle2" color="primary.main">Results</Typography>
                            {event.results.map((result, resultIndex) => {
                              const winnerNames = result.winner
                                .map((winner) => {
                                  if (winner.firstName || winner.lastName) {
                                    return `${winner.firstName ?? ''} ${winner.lastName ?? ''}`.trim()
                                  }
                                  return winner.name
                                })
                                .filter((name) => name.length > 0)
                              if (winnerNames.length === 0) return null
                              const prizeLabel = result.prize?.prizeName ? `${result.prize.prizeName}: ` : ''
                              return (
                                <Typography key={`result-${resultIndex}`} variant="body2">
                                  {prizeLabel}{winnerNames.join(', ')}
                                </Typography>
                              )
                            })}
                          </>
                        ) : null}
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
      </Content>
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