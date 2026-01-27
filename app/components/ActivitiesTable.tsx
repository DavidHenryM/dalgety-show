import { useEffect, useState } from 'react'
import { useSchedule } from '@lib/queryHooks'
import Loading from '@app/Loading'
import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid'
import { Accordion, AccordionDetails, AccordionSummary, Grid, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Stack } from '@mui/material'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import { createActivity, updateActivity, deleteActivity, updateSchedule } from '@lib/mutations'
import { ActivitiesTableForm } from '../types'

function toDate(value: number | string | Date): Date {
  if (value instanceof Date) {
    return value
  }
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return new Date()
  }
  return date
}

function formatTime(value: number | string | Date): string {
  const date = toDate(value)
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${hours}:${minutes}`
}

function toInputDateTime(value: number | string | Date): string {
  const date = toDate(value)
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${year}-${month}-${day}T${hours}:${minutes}`
}

export function ActivitiesTable(props: {title: string, showYear: number}){
  const [refreshKey, setRefreshKey] = useState<number>(0)
  const [schedule, activities, loading] = useSchedule(props.showYear, refreshKey)
  const emptySelection: GridRowSelectionModel = { type: 'include', ids: new Set() }
  const [selection, setSelection] = useState<GridRowSelectionModel>(emptySelection)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [releaseInput, setReleaseInput] = useState<string>('')
  const [confirmReleaseOpen, setConfirmReleaseOpen] = useState(false)
  const [confirmUnreleaseOpen, setConfirmUnreleaseOpen] = useState(false)
  const [form, setForm] = useState<ActivitiesTableForm>({
    id: -1,
    activityId: '',
    time: '',
    name: '',
    description: '',
    link: '',
    icon: ''
  })

  const rows = activities.map((activity, index) => ({
    id: index + 1,
    activityId: activity.id,
    time: formatTime(activity.time),
    timeValue: activity.time,
    name: activity.name,
    description: activity.description ?? '',
    link: activity.link ?? '',
    icon: activity.icon ?? ''
  }))

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'time', headerName: 'Time', width: 100 },
    { field: 'name', headerName: 'Activity', width: 200 },
    { field: 'description', headerName: 'Description', width: 280 },
    { field: 'link', headerName: 'Link', width: 220 },
    { field: 'icon', headerName: 'Icon', width: 140, description: "supported icons: https://fontawesome.com/search?ic=free-collection" }
  ]

  function openNew(){
    setIsEditing(false)
    setForm({ id: -1, activityId: '', time: toInputDateTime(new Date()), name: '', description: '', link: '', icon: '' })
    setDialogOpen(true)
  }

  useEffect(() => {
    async function fetchReleaseDate(){
      if (schedule?.released) {
        setReleaseInput(toInputDateTime(schedule.released))
      } else {
        setReleaseInput('')
      }
    }    
  fetchReleaseDate()
  }, [schedule?.released])

  function openEdit(){
    if (selection.ids.size === 0) return
    const sel = rows.find(r => r.id === Array.from(selection.ids)[0])
    if (!sel) return
    setIsEditing(true)
    setForm({
      id: sel.id,
      activityId: sel.activityId,
      time: toInputDateTime(sel.timeValue),
      name: sel.name,
      description: sel.description,
      link: sel.link,
      icon: sel.icon
    })
    setDialogOpen(true)
  }

  async function handleDelete(){
    if (selection.ids.size === 0) return
    const sel = rows.find(r => r.id === Array.from(selection.ids)[0])
    if (!sel) return
    await deleteActivity(sel.activityId)
    setRefreshKey(prev => prev + 1)
    setSelection(emptySelection)
  }

  async function handleSave(){
    try {
      const scheduleId = schedule?.id
      if (!scheduleId) return
      const time = form.time ? new Date(form.time) : null
      if (!time || Number.isNaN(time.getTime())) return
      if (isEditing){
        await updateActivity(form.activityId, {
          time: time,
          name: form.name,
          description: form.description || null,
          link: form.link || null,
          icon: form.icon || null
        })
      } else {
        await createActivity({
          scheduleId: scheduleId,
          time: time,
          name: form.name,
          description: form.description || null,
          link: form.link || null,
          icon: form.icon || null
        })
      }
      setDialogOpen(false)
      setRefreshKey(prev => prev + 1)
    } catch (err){
      console.error(err)
    }
  }

  async function handleReleaseSchedule(){
    try {
      if (!schedule?.id) return
      await updateSchedule(schedule.id, { released: new Date() })
      setRefreshKey(prev => prev + 1)
    } catch (err){
      console.error(err)
    }
  }

  async function handleSetReleaseDate(){
    try {
      if (!schedule?.id) return
      if (!releaseInput) return
      const releaseDate = new Date(releaseInput)
      if (Number.isNaN(releaseDate.getTime())) return
      await updateSchedule(schedule.id, { released: releaseDate })
      setRefreshKey(prev => prev + 1)
    } catch (err){
      console.error(err)
    }
  }

  async function handleUnreleaseSchedule(){
    try {
      if (!schedule?.id) return
      await updateSchedule(schedule.id, { released: null })
      setRefreshKey(prev => prev + 1)
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
          <Stack direction="row" spacing={2} sx={{ mb: 1, alignItems: 'center' }}>
            <Typography variant="subtitle2">
              {!schedule?.released
                ? 'Not released'
                : schedule.released > new Date()
                ? `Release scheduled ${schedule.released.toLocaleString()}`
                : `Released ${schedule.released.toLocaleString()}`}
            </Typography>
            <Button variant="contained" onClick={() => setConfirmReleaseOpen(true)} disabled={!schedule || (!!schedule.released && schedule.released <= new Date())}>Release now</Button>
            <Button variant="contained" color="warning" onClick={() => setConfirmUnreleaseOpen(true)} disabled={!schedule || !schedule.released}>Unrelease</Button>
          </Stack>
          <Stack direction="row" spacing={2} sx={{ mb: 1, alignItems: 'center' }}>
            <TextField
              label="Release date"
              type="datetime-local"
              value={releaseInput}
              onChange={(e) => setReleaseInput(e.target.value)}
              InputLabelProps={{ shrink: true }}
              size="small"
            />
            <Button variant="contained" onClick={handleSetReleaseDate} disabled={!schedule || !releaseInput}>Set release date</Button>
          </Stack>
          <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
            <Button variant="contained" onClick={openNew} disabled={!schedule}>New Activity</Button>
            <Button variant="contained" onClick={openEdit} disabled={selection.ids.size !== 1}>Edit</Button>
            <Button variant="contained" color="error" onClick={handleDelete} disabled={selection.ids.size !== 1}>Delete</Button>
          </Stack>
          <div style={{ height: 420, width: '100%' }}>
            <DataGrid
              rows={rows}
              columns={columns}
              pageSizeOptions={[5,10]}
              checkboxSelection
              onRowSelectionModelChange={(newSelection: GridRowSelectionModel) => setSelection(newSelection)}
            />
          </div>
        </AccordionDetails>
      </Accordion>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="md">
        <DialogTitle>{isEditing ? 'Edit Activity' : 'New Activity'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Time"
              type="datetime-local"
              value={form.time ?? ''}
              onChange={(e) => setForm({ ...form, time: e.target.value })}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField label="Activity Name" helperText="Text that is visible on the timeline" value={form.name ?? ''} onChange={(e) => setForm({ ...form, name: e.target.value })} fullWidth />
            <TextField label="Description" helperText="Optional hover text" value={form.description ?? ''} onChange={(e) => setForm({ ...form, description: e.target.value })} fullWidth multiline rows={3} />
            <TextField label="Link (without domain)" helperText="Example: /events/2026/Wood Chop" value={form.link ?? ''} onChange={(e) => setForm({ ...form, link: e.target.value })} fullWidth />
            <TextField label="Icon (FontAwesome name)" helperText="Example: tractor (supported icons: https://fontawesome.com/search?ic=free-collection)" value={form.icon ?? ''} onChange={(e) => setForm({ ...form, icon: e.target.value })} fullWidth />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={confirmReleaseOpen} onClose={() => setConfirmReleaseOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>Release schedule now?</DialogTitle>
        <DialogContent>
          <Typography variant="body2">This will set the release date to now and make the schedule public. Information will become visible to all visitors.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmReleaseOpen(false)}>Cancel</Button>
          <Button onClick={async () => {
            await handleReleaseSchedule()
            setConfirmReleaseOpen(false)
          }} variant="contained">Confirm</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={confirmUnreleaseOpen} onClose={() => setConfirmUnreleaseOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>Unrelease schedule?</DialogTitle>
        <DialogContent>
          <Typography variant="body2">This will clear the release date and hide the schedule from public view.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmUnreleaseOpen(false)}>Cancel</Button>
          <Button onClick={async () => {
            await handleUnreleaseSchedule()
            setConfirmUnreleaseOpen(false)
          }} variant="contained" color="warning">Confirm</Button>
        </DialogActions>
      </Dialog>
    </Grid>
  )
}
