"use client"

import { useEffect } from "react";
import { redirect } from 'next/navigation'
import { getNextShow } from "../lib/queries";
import Waiting from "../components/Waiting";

export default function Schedule(){
  useEffect(()=>{
    getNextShow().then((show)=>{
      if(show){
        redirect(`/schedule/${show.year}`)
      }
    })
  },[])

  return (<Waiting message={"Loading latest schedule"} open={true}></Waiting>)
}