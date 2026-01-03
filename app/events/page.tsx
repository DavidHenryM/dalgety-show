"use client"

import { useEffect, useState } from "react";
import { redirect } from 'next/navigation'
import { getShow } from "../lib/queries";
import { getNextShowDate } from "../utils";


export default function Events(){
  const [loading, setLoading] = useState(true)
  useEffect(()=>{
    setLoading(true)
    getShow(getNextShowDate().getFullYear()).then((show)=>{
      if(show){
        redirect(`/events/${show.year}`)
      }
      setLoading(false)
    })
  },[])

  return <></>
}