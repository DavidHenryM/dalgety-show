'use client'

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation'
import Waiting from "../components/Waiting";

export default function Gallery(){
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  useEffect(()=>{
    async function fetchShow() {
      try {
        const res = await fetch("/api/queries/getShowOfInterest")
        if (!res.ok) {
          setLoading(false)
          return
        }
        const show = await res.json()
        if (show?.year) {
          router.replace(`/gallery/${show.year}`)
          return
        }
      } catch {
        // ignore errors and just stop loading
      } finally {
        setLoading(false)
      }
    }
    fetchShow()
  },[router])

  return (<Waiting message="Loading Gallery" open={loading}/>)
};  

 