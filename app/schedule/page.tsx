"use client"

import { useEffect, useState } from "react";
import { redirect } from 'next/navigation'
import { getShow } from "../lib/queries";
import { getNextShowDate } from "../utils";
import Waiting from "../components/Waiting";

export default function Schedule(){
  useEffect(()=>{
    getShow(getNextShowDate().getFullYear()).then((show)=>{
      if(show){
        redirect(`/schedule/${show.year}`)
      }
    })
  },[])

  return (<Waiting message={"Loading latest schedule"} open={true}></Waiting>)
}