import sheepJudging from '../assets/images/gallery/Sheep_6.jpg'
import noDogs from '../assets/images/noDogs.png'
import { Background } from "../components/Background";
import { Card, CardContent, CardMedia, Grid, Paper, Typography } from "@mui/material";

export default function Home(props: {sideBarWidth: number}){
  return (
    <>
      <Background image={sheepJudging}/>
      <Grid container spacing={2} padding={2} sx={{ml: `${props.sideBarWidth}px`, mt: "25px", justifyContent: "center"}}>
        <Grid size={8} alignItems={"center"}>
          <Paper  sx={{p:2, backgroundColor:"secondary.main",  justifyItems: "center"}}>
            <Typography variant='h3' sx={{color: "primary.main"}}>The 82nd Annual Dalgety Show</Typography>
            <Typography variant='h4' sx={{color: "primary.main"}}>Live Well, Farm Well</Typography>
            <Typography component="p" variant='h6'>
              Nestled on the banks of the Snowy River, the Dalgety Show celebrates everything that makes rural life rich, resilient, and full of heart. This year’s theme, “Live Well, Farm Well,” shines a light on the health and wellbeing of our people, our animals, and our land — reminding us that a thriving community starts with caring for ourselves and each other.
            </Typography>
            <Typography component="p" variant='h6'>
              For a small town, Dalgety puts on one mighty show — and it’s famous across the region for it. From the crack of the stock whip to the laughter in the pavilion, the Dalgety Show brings generations together to celebrate the best of rural life.
            </Typography>
            <Typography component="p" variant='h6'>
              We might not have carnival rides, but we’ve got everything that really matters — family fun, great food, friendly competition, and genuine country hospitality. Whether you’re checking out the cattle, admiring local crafts, or cheering on a platypus by the river, the Dalgety Show is where community spirit shines brightest.
            </Typography>
            <Typography component="p" variant='h6'>
              So come along, enjoy a true agricultural show, and help us celebrate living well and farming well — the Dalgety way.
            </Typography>
          </Paper>
          </Grid>
          <Grid size={2}>
            <Card sx={{p:2, backgroundColor:"secondary.main"}}>
              <CardMedia 
                sx={{ height: 200, width: 150, justifySelf:"center"}}
                image={noDogs}/>
              <CardContent>
                Unfortunately domestic dogs are not permitted at the show. Our competing dogs, horses and livestock thank you in advance
              </CardContent>
            </Card>
          </Grid>
        </Grid>

    </>
  );
};

