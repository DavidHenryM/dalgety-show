"use client"

import { useEffect } from "react";
import { redirect } from 'next/navigation'
import { getLatestReleasedSchedule, getNextShow, getReleasedScheduleForShow } from "../lib/queries";
import Waiting from "../components/Waiting";

export default function Schedule(){
  useEffect(()=>{
    async function resolveShow(){
      const nextShow = await getNextShow()
      if (nextShow) {
        const releasedNextSchedule = await getReleasedScheduleForShow(nextShow.id)
        if (releasedNextSchedule) {
          redirect(`/schedule/${releasedNextSchedule.show.year}`)
          return
        }
      }
      const latestReleasedSchedule = await getLatestReleasedSchedule()
      if (latestReleasedSchedule) {
        redirect(`/schedule/${latestReleasedSchedule.show.year}`)
        return
      }
    }
    resolveShow()
  },[])

  return (<Waiting message={"Loading latest schedule"} open={true}></Waiting>)
}