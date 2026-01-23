"use client"

import { useEffect, useState } from "react";
import { redirect } from 'next/navigation'
import { getShow } from "../lib/queries";
import { getNextShowDate } from "../utils";
import Waiting from "../components/Waiting";


export default function Events(){
  const [loading, setLoading] = useState(true)
  useEffect(()=>{
    async function fetchData(){
      setLoading(true)
      getShow(getNextShowDate().getFullYear()).then((show)=>{
        if(show){
          redirect(`/events/${show.year}`)
        }
        setLoading(false)
      })
    }
    fetchData()
  },[])

  return (<Waiting message="Loading Events Page" open={loading}/>)
}