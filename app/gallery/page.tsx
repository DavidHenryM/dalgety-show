import { ImageList, ImageListItem, Paper } from "@mui/material";
import { drawerWidth, footerHeight } from "../settings";
import { galleryImages } from "../images/gallery/gallery"
import Image from "next/image";

export default function Gallery(){
  return (
    <Paper 
      sx={{
        ml: {
          sm: drawerWidth.sm,
          md: drawerWidth.md,
          lg: drawerWidth.lg
        },
        mb: footerHeight
      }}
    >
      <ImageList  cols={3} >
        {galleryImages.map((item) => (
          <ImageListItem key={item.src}>
            <Image
              sizes={`${item.src}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
              src={`${item.src}?w=164&h=164&fit=crop&auto=format`}
              loading="lazy" 
              alt=""
            />
          </ImageListItem>
        ))}
      </ImageList>
    </Paper>
  );
};  

 