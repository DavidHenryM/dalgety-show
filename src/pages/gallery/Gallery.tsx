import { ImageList, ImageListItem, Paper } from "@mui/material";

export default function Gallery(props: {images: string[], windowMargins: {ml: number, mb: number}}){
  return (
    <Paper sx={{ml: `${props.windowMargins.ml}px`}}>
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

 