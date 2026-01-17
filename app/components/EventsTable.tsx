import { useState } from 'react'
import { useEvents, useEventSections } from '@lib/queryHooks';
import Loading from '@app/Loading';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Accordion, AccordionDetails, AccordionSummary, Grid, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Stack } from '@mui/material';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { createEvent, updateEvent, deleteEvent } from '@lib/mutations';

export function EventsTable(props: {title: string, showYear: number}){
  const [refreshKey, setRefreshKey] = useState<number>(0)
  const [events, loading] = useEvents(props.showYear, refreshKey)
  const [sections, sectionsLoading] = useEventSections(props.showYear, refreshKey)
  const [selection, setSelection] = useState<number[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [form, setForm] = useState<any>({
    name: '',
    description: '',
    sectionId: '',
    maximumAge: '',
    minimumAge: '',
    gender: 'OPEN',
    entryFee: '',
    entryFeeTeam: ''
  })

  const rows = events.map((evt, index) => ({
    id: index+1,
    eventId: evt.id,
    eventName: evt.name,
    sectionId: evt.sectionId,
    description: evt.description ?? '',
    maximumAge: evt.maximumAge ?? '',
    minimumAge: evt.minimumAge ?? '',
    gender: evt.gender ?? 'OPEN',
    entryFee: evt.entryFee ?? '',
    entryFeeTeam: evt.entryFeeTeam ?? ''
  }))

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'eventName', headerName: 'Event', width: 220 },
    { field: 'sectionId', headerName: 'Section ID', width: 180 },
    { field: 'description', headerName: 'Description', width: 300 },
    { field: 'gender', headerName: 'Gender', width: 110 },
    { field: 'entryFee', headerName: 'Entry Fee', width: 110 },
  ]

  function openNew(){
    setIsEditing(false)
    setForm({name: '', description: '', sectionId: sections && sections.length>0 ? sections[0].id : '', maximumAge: '', minimumAge: '', gender: 'OPEN', entryFee: '', entryFeeTeam: ''})
    setDialogOpen(true)
  }

  function openEdit(){
    if (selection.length === 0) return
    const sel = rows.find(r=>r.id === selection[0])
    if (!sel) return
    setIsEditing(true)
    setForm({
      ...sel
    })
    setDialogOpen(true)
  }

  async function handleDelete(){
    if (selection.length === 0) return
    const sel = rows.find(r=>r.id === selection[0])
    if (!sel) return
    await deleteEvent(sel.eventId)
    setRefreshKey(prev=>prev+1)
    setSelection([])
  }

  async function handleSave(){
    try{
      if (isEditing){
        await updateEvent(form.eventId, {
          name: form.eventName,
          description: form.description,
          sectionId: form.sectionId,
          maximumAge: form.maximumAge ? Number(form.maximumAge) : null,
          minimumAge: form.minimumAge ? Number(form.minimumAge) : null,
          gender: form.gender,
          entryFee: form.entryFee ? Number(form.entryFee) : null,
          entryFeeTeam: form.entryFeeTeam ? Number(form.entryFeeTeam) : null
        })
      } else {
        // need show id: Events are created with showId; assume admin selects the showYear and show exists
        // get show id by calling getShow via queries inside createEvent in server: createEvent requires showId
        // Here we fetch show by calling getShow from client-side is not ideal; instead reuse existing createEvent signature expecting showId.
        // We'll attempt to find a show id from first existing event; if none, abort.
        const showId = events.length > 0 ? events[0].showId : undefined
        if (!showId){
          // cannot create without a show; simply close
          setDialogOpen(false)
          return
        }
        await createEvent({
          name: form.eventName,
          description: form.description,
          sectionId: form.sectionId,
          showId: showId,
          maximumAge: form.maximumAge ? Number(form.maximumAge) : null,
          minimumAge: form.minimumAge ? Number(form.minimumAge) : null,
          gender: form.gender,
          entryFee: form.entryFee ? Number(form.entryFee) : null,
          entryFeeTeam: form.entryFeeTeam ? Number(form.entryFeeTeam) : null
        })
      }
      setDialogOpen(false)
      setRefreshKey(prev=>prev+1)
    } catch (err){
      console.error(err)
    }
  }

  if (loading){
    return (<Loading />)
  }

  return (
    <Grid>
      <Accordion>
        <AccordionSummary expandIcon={<ArrowDownwardIcon />}>
          <Typography>{props.title}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
            <Button variant="contained" onClick={openNew}>New Event</Button>
            <Button variant="outlined" onClick={openEdit} disabled={selection.length!==1}>Edit</Button>
            <Button variant="outlined" color="error" onClick={handleDelete} disabled={selection.length!==1}>Delete</Button>
          </Stack>
          <div style={{ height: 420, width: '100%' }}>
            <DataGrid
              rows={rows}
              columns={columns}
              pageSizeOptions={[5,10]}
              checkboxSelection
              onRowSelectionModelChange={(newSelection:any) => setSelection(newSelection)}
            />
          </div>
        </AccordionDetails>
      </Accordion>

      <Dialog open={dialogOpen} onClose={()=>setDialogOpen(false)} fullWidth maxWidth="md">
        <DialogTitle>{isEditing ? 'Edit Event' : 'New Event'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField select label="Section" value={form.sectionId ?? ''} onChange={(e)=>setForm({...form, sectionId: e.target.value})} fullWidth>
              {sectionsLoading ? <MenuItem value="">Loading...</MenuItem> : sections.map((s:any)=>(
                <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>
              ))}
            </TextField>
            <TextField label="Event Name" value={form.eventName ?? form.name ?? ''} onChange={(e)=>setForm({...form, eventName: e.target.value})} fullWidth />
            <TextField label="Description" value={form.description ?? ''} onChange={(e)=>setForm({...form, description: e.target.value})} fullWidth multiline rows={3} />
            <Stack direction="row" spacing={2}>
              <TextField label="Min Age" value={form.minimumAge ?? ''} onChange={(e)=>setForm({...form, minimumAge: e.target.value})} />
              <TextField label="Max Age" value={form.maximumAge ?? ''} onChange={(e)=>setForm({...form, maximumAge: e.target.value})} />
              <TextField label="Entry Fee" value={form.entryFee ?? ''} onChange={(e)=>setForm({...form, entryFee: e.target.value})} />
              <TextField label="Team Fee" value={form.entryFeeTeam ?? ''} onChange={(e)=>setForm({...form, entryFeeTeam: e.target.value})} />
            </Stack>
            <TextField select label="Gender" value={form.gender ?? 'OPEN'} onChange={(e)=>setForm({...form, gender: e.target.value})}>
              <MenuItem value={'OPEN'}>OPEN</MenuItem>
              <MenuItem value={'MEN'}>MEN</MenuItem>
              <MenuItem value={'WOMEN'}>WOMEN</MenuItem>
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Grid>
  )
}
