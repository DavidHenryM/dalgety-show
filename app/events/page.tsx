"use client"

import { useEffect, useState } from "react";
import { redirect } from 'next/navigation'
import { getLastShow, getShowOfInterest } from "../lib/queries";
import Waiting from "../components/Waiting";


export default function Events(){
  const [loading, setLoading] = useState(true)
  useEffect(()=>{
    async function fetchData(){
      setLoading(true)
      const show = await getShowOfInterest()
      if (show) {
        redirect(`/events/${show.year}`)
        return
      }
      const lastShow = await getLastShow()
      if (lastShow) {
        redirect(`/events/${lastShow.year}`)
        return
      }
      setLoading(false)
    }
    fetchData()
  },[])

  return (<Waiting message="Loading Events Page" open={loading}/>)
}