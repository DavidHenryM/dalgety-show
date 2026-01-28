"use client"

import { useEffect, useState } from "react";
import { redirect } from 'next/navigation'
import { getLastShow, getNextShow } from "@lib/queries";
import Waiting from "@/app/components/Waiting";

export default function Stalls() {
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    async function resolveShow(){
      const nextShow = await getNextShow()
      if (nextShow) {
        redirect(`/stalls/${nextShow.year}`)
        return
      }
      const lastShow = await getLastShow()
      if (lastShow) {
        redirect(`/stalls/${lastShow.year}`)
        return
      }
      setLoading(false)
    }
    resolveShow()
  },[])

  return (<Waiting message="Loading stalls" open={loading}/>)
}
