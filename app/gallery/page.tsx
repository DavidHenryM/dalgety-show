'use client'

import { useEffect, useState } from "react";
import { redirect } from 'next/navigation'
import { getShowOfInterest } from "../lib/queries";
import Waiting from "../components/Waiting";

export default function Gallery(){
  const [loading, setLoading] = useState(true)
  useEffect(()=>{
    getShowOfInterest().then((show)=>{
      if(show){
        redirect(`/gallery/${show.year}`)
      }
      setLoading(false)
    })
  },[])

  return (<Waiting message="Loading Gallery" open={loading}/>)
};  

 