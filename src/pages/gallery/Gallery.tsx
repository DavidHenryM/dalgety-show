import { ImageList, ImageListItem, Paper } from "@mui/material";
import { drawerWidth } from "../../styles/settings";

export default function Gallery(props: {images: string[]}){
  return (
    <Paper 
      sx={{
        ml: {
          sm: drawerWidth.sm,
          md: drawerWidth.md,
          lg: drawerWidth.lg
        } 
      }}
    >
      <ImageList  cols={3} >
        {props.images.map((item) => (
          <ImageListItem key={item}>
            <img
              srcSet={`${item}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
              src={`${item}?w=164&h=164&fit=crop&auto=format`}
              loading="lazy"
            />
          </ImageListItem>
        ))}
      </ImageList>
    </Paper>
  );
};

 