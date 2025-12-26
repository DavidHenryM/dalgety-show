import { Grid, Paper, Typography } from "@mui/material";
import { Background } from "../../components/Background";
import cow1 from '../../assets/images/gallery/Cow_1.jpg'
import { drawerWidth, footerHeight } from "../../styles/settings";

export default function About() {
  return (
    <>
      <Background image={cow1} />
      <Grid 
        container 
        spacing={2} 
        sx={{
          p: {
            sm: 1, 
            md: 2, 
            lg: 10
          }, 
          ml: {
            sm: drawerWidth.sm,
            md: drawerWidth.md,
            lg: drawerWidth.lg
          },
          mb: footerHeight
        }}
      >
        <Grid size={12}>
          <Paper sx={{p:2}}>
            <Typography variant="h4">The Show</Typography>
            <Typography>The Dalgety Show has been running for over a century and showcases
              livestock, horses, produce, crafts, and rural skills.</Typography>
          </Paper>
      </Grid>
      <Grid size={12}>
        <Paper sx={{p:2}}>
          <Typography variant="h4">The Capital</Typography>
          <Typography>
          {
            `Over 100 years ago, in 1904, it was gazetted in Federal Parliament that the town of Dalgety would become the site for the Capital City of Australia. Dalgety was a popular choice at the time due to it being exactly halfway between Sydney and Melbourne and a suitable distance inland to avoid attack from the sea!! The senators came and “bathed in the river” and a decision was made in favour of the town. Extracts from a Sydney newspaper of the time say “Our representative, who has photographed every one of the sites, and who has been over practically every corner of the Commonwealth, is one of the enthusiasts with regard to Dalgety.”

  Federal Parliament passed the “Seat of Government” Act in 1904 declaring that the Capital should be within 17 miles of Dalgety.

  The N.S.W. Government, which alone had the constitutional authority to surrender lands for a National Capital, objected to the proposal on two grounds. Firstly it had not been consulted and secondly the Federal Parliament was seeking a site nine times larger than the minimum of 100 square miles specified in the Australian Constitution Act.

  On the 16th September 1908 (following lobbying from Sydney businesses who believed that Twofold Bay would become the port for the Capital and not Sydney) the Federal Parliament dropped its preference for Dalgety and voted for a site at Yass/Canberra.”.

  For four years it was imagined that Dalgety would one day be a large cosmopolitan city - but that wasn't to be. Today, Dalgety has changed little since that time over 100 years ago.
`}</Typography>
</Paper>
</Grid>
    <Grid size={12}>
      <Paper sx={{p:2}}>
        <Typography variant="h4">The Town</Typography>
        <Typography>
{`
  Dalgety is a small town near the Snowy Mountains, 50 kms south of Cooma and 35 kms from Jindabyne. Although less than two hours drive from Canberra, Dalgety is still very much your typical Australian country town. There is a great pub, a two-teacher school, a quaint garage, a small café/shop, a shady caravan park, a picturesque showground (the last two on the banks of the famous Snowy River) and an enthusiastic country community.

  As in many small communities the local show is one of the highlights of the year. The Dalgety Show, held on the first Sunday in March, is no different. For over 60 years it has operated as the only agricultural show in the Snowy River Shire, a shire with a mixed interest of agriculture and tourism, and draws on people from a large geographical area.

  The first show in 1945 was officially held to raise money to build a Memorial Hall to honour soldiers fighting in the war. This show, described by one involved as “a pretty rough turnout” was followed by several shows that didn’t make any money and where no records were kept. However, the fact that the show has been successfully held every year since then is a tribute to the ingenuity and determination of the small community.

  There are the usual horses, cattle, sheep, poultry and wool sections and sections with flowers, vegetables, cakes, condiments, knitting, arts and crafts, home brew and many more. But Dalgety Show offers so much more.

  There are the yard dog trials, with a large line up of energetic and talented dogs; a comprehensive horse show with some fantastic show jumping and three hack rings; music and magic for the children and many displays by local businesses.

  In the Memorial Hall (built with money raised from earlier Dalgety Shows) there is a large display of local art and a comprehensive display of quilts, both by some of Australia's best-known quilters as well as local entries.

  Country shows, with the sounds and smells, the sideshows and sections, are a part of Australian history. And so is the town of Dalgety.

  Why not come and experience it!!!`}
        </Typography>
      </Paper>
      </Grid>
    </Grid>
  </>
  );
}