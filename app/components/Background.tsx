import { Box } from "@mui/material";
import { StaticImageData } from "next/image";

export function Background(props: {image: StaticImageData}){
  return (
    <Box
      sx={{
        backgroundImage: `url(${props.image.src})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh',
        width: '100vw',
        opacity: 0.5,
        position: 'fixed', // Keeps background stationary while scrolling
        top: 0,
        left: 0,
        zIndex: -1, // Ensures background stays behind content
      }}
    />
  )
}