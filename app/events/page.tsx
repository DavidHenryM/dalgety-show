"use client"

import { useEffect, useState } from "react";
import { redirect } from 'next/navigation'
import { getLatestReleasedSchedule } from "../lib/queries";
import Waiting from "../components/Waiting";


export default function Events(){
  const [loading, setLoading] = useState(true)
  useEffect(()=>{
    async function fetchData(){
      setLoading(true)
      const latestReleasedSchedule = await getLatestReleasedSchedule()
      if (latestReleasedSchedule) {
        redirect(`/events/${latestReleasedSchedule.show.year}`)
        return
      }
      setLoading(false)
    }
    fetchData()
  },[])

  return (<Waiting message="Loading Events Page" open={loading}/>)
}