import { useState } from "react"
import type { EventSection, Show } from "../generated/prisma/browser"
import { Button, Card, CardActions, CardContent, CardMedia, Grid, IconButton, Link, TextField, Typography } from "@mui/material"
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

import { updateEventSection  } from "@/app/lib/mutations";

export function EventSectionCard(props: {section: EventSection, locked: boolean, show: Show}){
  const [editDescription, setEditDescription] = useState<boolean>(false)
  const [sectionDescription, setSectionDescription] = useState<string>(props.section.description ? props.section.description : "")

  const [section, setSection] = useState(props.section)
  const locked = props.locked
  const show = props.show

  function handelUpdateEventSection(sectionId: string, data: {description: string | null}){
    updateEventSection(sectionId, data).then((eventSection)=>{
      setSection({...section, ...eventSection})
    }).catch((e)=>console.error("Error whilst updating event section data: ", e))
  }
  

  return(
  <Grid size={{sm: 12, md: 6, lg: 6, xl: 4, xxl: 3}}>
    <Card sx={{ width: 345, backgroundColor: "secondary.main" }} elevation={8}>
      <CardMedia
        sx={{ height: 140 }}
        image={section.image ? section.image : ""}
        title={section.name}
      />
      <CardContent>
        <Typography color="primary" variant="h5" component="div">
          {section.name}
        </Typography>
        {locked == false && editDescription == false ?
        <IconButton aria-label="edit description" onClick={()=>setEditDescription(true)}>
          <EditIcon />
        </IconButton>: <></>
        }
        { editDescription && !locked? 
        <>
        <TextField label="Description" value={sectionDescription} onChange={(e)=>setSectionDescription(e.target.value)} fullWidth ></TextField> 
          <IconButton aria-label="save description" onClick={()=>{setEditDescription(false); handelUpdateEventSection(section.id, {description: sectionDescription})}}>
            <SaveIcon />
          </IconButton>
          <IconButton aria-label="cancel" onClick={()=>setEditDescription(false)}>
            <CancelIcon />
          </IconButton>
          </>
          :
          <Typography variant="body2" sx={{ color: 'text.secondary', whiteSpace: 'pre-line' }}>
            {section.description}
          </Typography>
          
        }
      </CardContent>
      <CardActions>
        {/* <Button size="small" variant="contained" onClick={()=>handleSeeEvents(section)}>See events</Button> */}
        <Link href={`${show?.year}/${section.name}`}>
          <Button size="small" variant="contained">See events</Button>
        </Link>
      </CardActions>
    </Card>
  </Grid>
  )
}