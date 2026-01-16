"use client"

import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Grid, Paper, Stack, Typography } from "@mui/material";
import { drawerWidth, footerHeight } from "../../settings";
import { Background } from "../../components/Background";
import { backgroundImages } from "../../images/backgrounds";
import { Dispatch, SetStateAction, use, useEffect, useState } from "react";
import { getEventSections, getShow } from "@lib/queries";
import { getDateString } from "../../utils";
import { Event, EventSection, Show } from "../../generated/prisma/client";
import Skeleton from '@mui/material/Skeleton';

import { EventSectionCard } from "@/app/components/EventSectionCard";
import { useUserSession } from "@lib/session";
import EditLock from "@components/EditLock";
import { TransitionUp } from "@components/Tansitions";

export default function EventsYear({params}: {params: Promise<{ year: string }>}) {
  const { year } = use(params)
  const { user: user, data: session } = useUserSession()
  const [eventSections, setEventSections] = useState<EventSection[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [show, setShow] = useState<Show>()
  const [eventsDetailsOpen, setEventsDetailsOpen] = useState(false)
  const [eventsDetails, setEventsDetails] = useState<Event[]>([])
  const [selectedSection, setSelectedSection] = useState<EventSection>()
  const [locked, setLocked] = useState<boolean>(true)
  

  useEffect(()=>{
    setLoading(true)
    getShow(Number(year)).then((thisShow)=>{
      if (thisShow){
        setShow(thisShow)
        getEventSections(thisShow.id).then((theseEventSections)=>{
          if (theseEventSections){
            setEventSections(theseEventSections)
            setLoading(false)
          } else {
            setLoading(false)
          }  
        })
      } else {
        setLoading(false)
      }
    })
    
  },[])

  return (
    <>
      <Background image={backgroundImages[2]} />
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
          <Paper sx={{p:2, backgroundColor: "secondary.main",  position: 'relative'}}>
            <EditLock locked={locked} setLocked={setLocked} userFirstName={user?.firstName}/>
            <Typography sx={{p:2}} variant="h4" color="primary.main" justifySelf="center">{`Events ${show?.year ? show?.year : ""}`}</Typography>
            <Divider />
            <Grid container sx={{p:2}} size={12} spacing={2}>
            { loading ? 
              new Array(12).fill(0).map((item, index)=>{
                return (
                  <Grid key={`skeleton-${index}`} size={{sm: 12, md: 12, lg: 8, xl:6}}>
                    <Skeleton variant="rectangular" height="200px" width="340px"/>
                    <Skeleton variant="text" height="50px" width="340px"/> 
                    <Skeleton variant="text" height="50px" width="340px"/> 
                  </Grid>
                )
              })
            : 
              eventSections.map((section, index)=>{
                if (show){
                  return(<EventSectionCard section={section} key={index} locked={locked} show={show}></EventSectionCard>)
                }
              })
            }
            </Grid>
          </Paper>
        </Grid>
      </Grid>
      <EventDialog open={eventsDetailsOpen} setOpen={setEventsDetailsOpen} events={eventsDetails} section={selectedSection}/>
      </>
  )
}



function EventDialog(props: {open: boolean, setOpen: Dispatch<SetStateAction<boolean>>, events: Event[], section: EventSection | undefined}){
  function handleClose(): void {
    props.setOpen(false)
  }

  return (
    <Dialog
      open={props.open}
      slots={{
        transition: TransitionUp,
      }}
      keepMounted
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description"
    >
      {
        props.section?.letter ? 
          <DialogTitle variant="h5" color="primary.main">{`Section ${props.section.letter} ${props.section.name}`}</DialogTitle> :
          <DialogTitle variant="h5" color="primary.main">{props.section?.name}</DialogTitle>
      }
      <Divider/>
      <DialogContent>
        <DialogContentText variant="subtitle1" color="primary.main">{props.section?.details}</DialogContentText>
        <Divider/>
        <Stack padding={3}spacing={3}>
          {
            props.events.map((event, index)=>{
              return (
                <div key={`event-${index}`}>
                  <DialogContentText id="alert-dialog-slide-description"variant="h6">{event.name}</DialogContentText>
                  <DialogContentText>{event.description}</DialogContentText>
                    {
                      event.entryFee ? 
                      <DialogContentText>{`Entry fee: $${event.entryFee?.toFixed(0)}`}</DialogContentText> : <></>
                    }
                    {
                      event.entryFeeTeam ?
                      <DialogContentText>{`Team entry fee: $${event.entryFeeTeam?.toFixed(0)}`}</DialogContentText> : <></>
                    }
                </div>
              )
            })
          }
          <Divider/>

          {props.section?.entryInstructions?.split("\\n").map((line, index)=>{
            return (<DialogContentText key={`line-${index}`} variant="subtitle2" color="primary.main">{line}</DialogContentText>)
          })}
          { props.section?.entryClose ?
            <DialogContentText variant="subtitle2" color="primary.main">
              {`Entires close on ${getDateString(props.section.entryClose)}`}
            </DialogContentText> : <></>
          }
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  )
}


