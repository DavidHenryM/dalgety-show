"use client"

import { useEffect } from "react";
import { redirect } from 'next/navigation'
import { getLastShow, getNextShow } from "../lib/queries";
import Waiting from "../components/Waiting";

export default function Schedule(){
  useEffect(()=>{
    async function resolveShow(){
      const nextShow = await getNextShow()
      if (nextShow) {
        redirect(`/schedule/${nextShow.year}`)
        return
      }
      const lastShow = await getLastShow()
      if (lastShow) {
        redirect(`/schedule/${lastShow.year}`)
        return
      }
    }
    resolveShow()
  },[])

  return (<Waiting message={"Loading latest schedule"} open={true}></Waiting>)
}