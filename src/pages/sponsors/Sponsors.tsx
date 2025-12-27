import { Divider, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Toolbar, Typography } from "@mui/material";
import { drawerWidth, footerHeight } from "../../styles/settings"
import { Background } from "../../components/Background";
import sheepJudging from '../../assets/images/gallery/Sheep_6.jpg'
import { BulletList } from "../../components/BulletList";


export default function Sponsors(){
  return (
    <>
      <Background image={sheepJudging}/>
      <Grid 
        container 
        spacing={2} 
        padding={2} 
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
          mt: "25px", 
          mb: footerHeight,
          justifyContent: "center"
        }}
      >
        <Grid size={6}>
          <Paper sx={{p:2, backgroundColor: "secondary.main"}}>
            <Typography component={"p"}>
              The Dalgety Show is an annual community event celebrating the best of local
              agriculture, arts, and community spirit. Each year, we bring together families,
              friends, and supporters from across the region, and we could not do it without our
              incredible sponsors, volunteers, and community supporters. Your generosity
              ensures this valued community tradition continues to thrive, and we are sincerely
              grateful for your support. 
            </Typography>
            <Typography component={"p"}>
              With over 3000 people through the gate, entrants and visitors travelling from afar
                to enjoy the day this little country town puts on a great experience and cannot be
                done without your generosity and support. 
            </Typography>
            <Typography component={"p"}>
              This year there are more ways to support the Dalgety Show, select any, multiple or
                all options set out below:
            </Typography>
          </Paper>
        </Grid>
        <Grid size={6}>
          <Paper sx={{p:2, backgroundColor: "secondary.main"}}>
            <Typography variant="h5">Sponsorship Package / Advertising</Typography>
            <Typography variant="body1">
              Contribute financially and receive recognition in the promotion of the show and listing in the show program & website. 
              Option available to purchase additional advertising space for your business in the program.
            </Typography>
            <Divider/>
            <Typography variant="h5">Major Raffle - Raffle Prize</Typography>
            <Typography variant="body1" >
              Donation of item/s, vouchers or business services as a raffle prize. 
              Promotion will be via the dedicated raffle website & social media.
            </Typography>
            <Divider/>
            <Typography variant="h5">Platypus Plunge - Corporate</Typography>
            <Typography variant="body1">
              Select to be a corporate sponsor and get your very own platypus in the race.
              Limit of 1 per business.
            </Typography>
          </Paper>
        </Grid>
        <Grid size={6} spacing={2}>
          <Paper sx={{p: 2, backgroundColor: "secondary.main"}} elevation={8}>
            <Toolbar sx={{ backgroundColor: "cornflowerblue", justifyContent: "center"}}>
              <Typography variant="h4">Dalgety Show Sponsorship Packages</Typography>
            </Toolbar>
            <TableContainer component={Paper} sx={{p:1}}>
              <Table sx={{ minWidth: 650 }} aria-label="sponsorship packages">
                <TableHead>
                  <TableRow sx={{ backgroundColor: "cornflowerblue"}}>
                    <TableCell>Level</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Inclusions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow sx={{ backgroundColor: "gainsboro"}}>
                    <TableCell align="center"><Typography variant="h5">Platnium</Typography></TableCell>
                    <TableCell align="center"><Typography variant="h5">$2,000+</Typography></TableCell>
                    <TableCell align="left">
                      <BulletList listItems={
                        [
                          "Full-page advertisement in Show Booklet.",
                          "Business (logo) listed on Dalgety Show website.",
                          "Business name advertised during show via public announcement system (4+ times)",
                          "4 passes to attend the show.",
                          "Business banner (if supplied) displayed in a prominent position during the show.",
                          "Free site space for business (if required)"
                        ]
                      }/>
                    
                    </TableCell>
                  </TableRow>
                  <TableRow sx={{ backgroundColor: "lemonchiffon"}}>
                    <TableCell align="center"><Typography variant="h5">Gold</Typography></TableCell>
                    <TableCell align="center"><Typography variant="h5">$1,000 - $1,999</Typography></TableCell>
                    <TableCell align="left">
                      <BulletList listItems={
                        [
                          "½ -page advertisement in Show Booklet.",
                          "Business (logo) listed on Dalgety Show website.",
                          "Business name advertised during show via public announcement system (at least 3 times)",
                          "2 passes to attend the show.",
                          "Logo on Gold sponsor signage at the show.",
                          "Free site space for business (if required)"
                        ]
                      }/>              
                    </TableCell>
                  </TableRow>
                  <TableRow sx={{ backgroundColor: "silver"}}>
                    <TableCell align="center"><Typography variant="h5">Silver</Typography></TableCell>
                    <TableCell align="center"><Typography variant="h5">$500 - $999</Typography></TableCell>
                    <TableCell align="left">
                      <BulletList listItems={
                        [
                          "¼ -page advertisement in Show Booklet.",
                          "Business (logo) listed on Dalgety Show website.",
                          "Business name advertised during show via public announcement system (at least twice)",
                          "2 passes to attend the show.",
                          "Logo on Silver sponsor signage at the show.",
                          "Priority booking option for stall site (½ price)"
                        ]
                      }/>              
                    </TableCell>
                  </TableRow>
                  <TableRow sx={{ backgroundColor: "goldenrod" }}>
                    <TableCell align="center"><Typography variant="h5">Bronze</Typography></TableCell>
                    <TableCell align="center"><Typography variant="h5">$250 - $499</Typography></TableCell>
                    <TableCell align="left">
                      <BulletList listItems={
                        [
                          "Business listed in Show Booklet.",
                          "Business name listed on Dalgety Show website.",
                          "Free adult pass to attend the show.",
                          "Priority booking option for stall site (full cost)",
                        ]
                      }/>              
                    </TableCell>
                  </TableRow>
                  <TableRow sx={{ backgroundColor: "mediumseagreen" }}>
                    <TableCell align="center"><Typography variant="h5">Section</Typography></TableCell>
                    <TableCell align="center"><Typography variant="h5">$10 - $249</Typography></TableCell>
                    <TableCell align="left">
                      <BulletList listItems={
                        [
                          "Business listed in Show Booklet against the section sponsored.",
                          "Business name listed on Dalgety Show website under section sponsored.",
                        ]
                      }/>              
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </>
  )
}