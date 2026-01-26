'use client'

import { useEffect, useState } from 'react'
import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid'
import { Accordion, AccordionDetails, AccordionSummary, Collapse, Grid, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Stack, IconButton } from '@mui/material'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import Loading from '@app/Loading'
import { getEventSectionByName, getSectionEventsAndPrizes, getShow } from '@lib/queries'
import { createEvent, createPrize, deleteEvent, deletePrize, updateEvent, updatePrize } from '@lib/mutations'
import type { Event, EventSection, Prize, Show } from '@generated/browser'
import { Gender } from '@generated/enums'
import { EventTableForm, PrizeTableForm } from '../types'

export function EventsSectionTable(props: { title: string; showYear: number; sectionName: string }) {
  const [refreshKey, setRefreshKey] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(true)
  const [events, setEvents] = useState<(Event & { prizes?: Prize[] })[]>([])
  const [show, setShow] = useState<Show>()
  const [section, setSection] = useState<EventSection>()
  const emptySelection: GridRowSelectionModel = { type: 'include', ids: new Set() }
  const [selection, setSelection] = useState<GridRowSelectionModel>(emptySelection)
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [activeEventId, setActiveEventId] = useState<string | null>(null)
  const [prizeSelection, setPrizeSelection] = useState<GridRowSelectionModel>(emptySelection)
  const [prizeDialogOpen, setPrizeDialogOpen] = useState(false)
  const [isPrizeEditing, setIsPrizeEditing] = useState(false)
  const [form, setForm] = useState<EventTableForm>({
    id: -1,
    eventId: '',
    eventName: '',
    description: '',
    maximumAge: '',
    minimumAge: '',
    gender: 'OPEN',
    entryFee: '',
    entryFeeTeam: ''
  })
  const [prizeForm, setPrizeForm] = useState<PrizeTableForm>({
    id: -1,
    prizeId: '',
    prizeName: '',
    cashPrizeValue: '',
    trophyName: '',
    ribbonName: ''
  })

  useEffect(() => {
    async function fetchData() {
    setLoading(true)
    getShow(props.showYear)
      .then((thisShow) => {
        if (thisShow) {
          setShow(thisShow)
          return getEventSectionByName(props.sectionName, thisShow.id)
        }
        return null
      })
      .then((thisSection) => {
        if (thisSection) {
          setSection(thisSection)
          return getSectionEventsAndPrizes(thisSection.id)
        }
        return []
      })
      .then((sectionEvents) => {
        setEvents(sectionEvents ?? [])
      })
      .finally(() => setLoading(false))
    }
    fetchData()
  }, [props.showYear, props.sectionName, refreshKey])

  const rows = events.map((evt, index) => ({
    id: index + 1,
    eventId: evt.id,
    eventName: evt.name,
    description: evt.description ?? '',
    maximumAge: evt.maximumAge ?? '',
    minimumAge: evt.minimumAge ?? '',
    gender: evt.gender ?? 'OPEN',
    entryFee: evt.entryFee ?? '',
    entryFeeTeam: evt.entryFeeTeam ?? '',
    prizesData: evt.prizes ?? []
  }))

  const columns: GridColDef[] = [
    {
      field: 'expand',
      headerName: '',
      width: 60,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const isExpanded = expandedEventId === params.row.eventId
        return (
          <IconButton size="small" onClick={() => setExpandedEventId(isExpanded ? null : params.row.eventId)}>
            {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        )
      }
    },
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'eventName', headerName: 'Event', width: 220 },
    { field: 'description', headerName: 'Description', width: 300 },
    { field: 'gender', headerName: 'Gender', width: 110 },
    { field: 'entryFee', headerName: 'Entry Fee', width: 110 }
  ]

  function openNew() {
    setIsEditing(false)
    setActiveEventId(null)
    setPrizeSelection(emptySelection)
    setForm({
      id: -1,
      eventId: '',
      eventName: '',
      description: '',
      maximumAge: '',
      minimumAge: '',
      gender: 'OPEN',
      entryFee: '',
      entryFeeTeam: ''
    })
    setDialogOpen(true)
  }

  function openEdit() {
    const selectedIds = Array.from(selection.ids)
    if (selectedIds.length === 0) return
    const sel = rows.find((r) => r.id === selectedIds[0])
    if (!sel) return
    setIsEditing(true)
    setActiveEventId(sel.eventId)
    setPrizeSelection(emptySelection)
    setForm({
      ...sel
    })
    setDialogOpen(true)
  }

  async function handleDelete() {
    const selectedIds = Array.from(selection.ids)
    if (selectedIds.length === 0) return
    const sel = rows.find((r) => r.id === selectedIds[0])
    if (!sel) return
    await deleteEvent(sel.eventId)
    setRefreshKey((prev) => prev + 1)
    setSelection(emptySelection)
  }

  async function handleSave() {
    try {
      if (!show || !section || !form.eventId) return
      if (isEditing) {
        await updateEvent({
          id: form.id,
          eventName: form.eventName,
          description: form.description,
          sectionId: section.id,
          maximumAge: form.maximumAge ? Number(form.maximumAge) : undefined,
          minimumAge: form.minimumAge ? Number(form.minimumAge) : undefined,
          gender: form.gender,
          entryFee: form.entryFee ? Number(form.entryFee) : undefined,
          entryFeeTeam: form.entryFeeTeam ? Number(form.entryFeeTeam) : undefined
        }, form.eventId)
      } else {
        await createEvent({
          id: form.id,
          eventName: form.eventName,
          description: form.description,
          sectionId: section.id,
          maximumAge: form.maximumAge ? Number(form.maximumAge) : undefined,
          minimumAge: form.minimumAge ? Number(form.minimumAge) : undefined,
          gender: form.gender,
          entryFee: form.entryFee ? Number(form.entryFee) : undefined,
          entryFeeTeam: form.entryFeeTeam ? Number(form.entryFeeTeam) : undefined
        }, show.id)
      }
      setDialogOpen(false)
      setRefreshKey((prev) => prev + 1)
    } catch (err) {
      console.error(err)
    }
  }

  const prizeColumns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'prizeName', headerName: 'Prize', width: 200 },
    { field: 'cashPrizeValue', headerName: 'Cash', width: 120 },
    { field: 'trophyName', headerName: 'Trophy', width: 160 },
    { field: 'ribbonName', headerName: 'Ribbon', width: 160 }
  ]

  function openPrizeNew(eventId: string) {
    setIsPrizeEditing(false)
    setActiveEventId(eventId)
    setPrizeSelection(emptySelection)
    setPrizeForm({ id: -1, prizeId: '', prizeName: '', cashPrizeValue: '', trophyName: '', ribbonName: '' })
    setPrizeDialogOpen(true)
  }

  function openPrizeEdit(eventId: string, prizeRows: PrizeTableForm[]) {
    const selectedIds = Array.from(prizeSelection.ids)
    if (selectedIds.length === 0 || activeEventId !== eventId) return
    const sel = prizeRows.find((r) => r.id === selectedIds[0])
    if (!sel) return
    setIsPrizeEditing(true)
    setActiveEventId(eventId)
    setPrizeForm({
      id: sel.id,
      prizeId: sel.prizeId,
      prizeName: sel.prizeName,
      cashPrizeValue: sel.cashPrizeValue,
      trophyName: sel.trophyName,
      ribbonName: sel.ribbonName
    })
    setPrizeDialogOpen(true)
  }

  async function handlePrizeDelete(eventId: string, prizeRows: PrizeTableForm[]) {
    const selectedIds = Array.from(prizeSelection.ids)
    if (selectedIds.length === 0 || activeEventId !== eventId) return
    const sel = prizeRows.find((r) => r.id === selectedIds[0])
    if (!sel) return
    await deletePrize(sel.prizeId)
    setRefreshKey((prev) => prev + 1)
    setPrizeSelection(emptySelection)
  }

  async function handlePrizeSave() {
    try {
      if (!activeEventId) return
      if (isPrizeEditing) {
        await updatePrize(prizeForm.prizeId, {
          prizeName: prizeForm.prizeName || null,
          cashPrizeValue: prizeForm.cashPrizeValue ? Number(prizeForm.cashPrizeValue) : null,
          trophyName: prizeForm.trophyName || null,
          ribbonName: prizeForm.ribbonName || null
        })
      } else {
        await createPrize({
          eventId: activeEventId,
          prizeName: prizeForm.prizeName || null,
          cashPrizeValue: prizeForm.cashPrizeValue ? Number(prizeForm.cashPrizeValue) : null,
          trophyName: prizeForm.trophyName || null,
          ribbonName: prizeForm.ribbonName || null
        })
      }
      setPrizeDialogOpen(false)
      setRefreshKey((prev) => prev + 1)
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) {
    return <Loading />
  }

  function getPrizeRowsForEvent(eventId: string) {
    const event = events.find((evt) => evt.id === eventId)
    return (event?.prizes ?? []).map((prize, index) => ({
      id: index + 1,
      prizeId: prize.id,
      prizeName: prize.prizeName ?? '',
      cashPrizeValue: prize.cashPrizeValue ?? '',
      trophyName: prize.trophyName ?? '',
      ribbonName: prize.ribbonName ?? ''
    }))
  }

  function renderPrizePanel(eventId: string) {
    const prizeRows = getPrizeRowsForEvent(eventId)
    return (
      <Stack spacing={2} sx={{ p: 2 }}>
        <Typography variant="subtitle1">Prizes</Typography>
        <Stack direction="row" spacing={2}>
          <Button variant="contained" onClick={() => openPrizeNew(eventId)}>New Prize</Button>
          <Button variant="outlined" onClick={() => openPrizeEdit(eventId, prizeRows)} disabled={Array.from(prizeSelection.ids).length !== 1 || activeEventId !== eventId}>Edit</Button>
          <Button variant="outlined" color="error" onClick={() => handlePrizeDelete(eventId, prizeRows)} disabled={Array.from(prizeSelection.ids).length !== 1 || activeEventId !== eventId}>Delete</Button>
        </Stack>
        <div style={{ height: 280, width: '100%' }}>
          <DataGrid
            rows={prizeRows}
            columns={prizeColumns}
            pageSizeOptions={[5, 10]}
            checkboxSelection
            rowSelectionModel={activeEventId === eventId ? prizeSelection : emptySelection}
            onRowSelectionModelChange={(newSelection: GridRowSelectionModel) => {
              setActiveEventId(eventId)
              setPrizeSelection(newSelection)
            }}
          />
        </div>
      </Stack>
    )
  }

  return (
    <Grid>
      <Accordion>
        <AccordionSummary expandIcon={<ArrowDownwardIcon />}>
          <Typography>{props.title}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
            <Button variant="contained" onClick={openNew} disabled={!section || !show}>New Event</Button>
            <Button variant="outlined" onClick={openEdit} disabled={selection.ids.size !== 1}>Edit</Button>
            <Button variant="outlined" color="error" onClick={handleDelete} disabled={selection.ids.size !== 1}>Delete</Button>
          </Stack>
          <div style={{ height: 420, width: '100%' }}>
            <DataGrid
              rows={rows}
              columns={columns}
              pageSizeOptions={[5, 10]}
              checkboxSelection
              onRowSelectionModelChange={(newSelection: GridRowSelectionModel) => {
                setSelection(newSelection)
              }}
            />
          </div>
          <Collapse in={!!expandedEventId} timeout="auto" unmountOnExit>
            {expandedEventId ? renderPrizePanel(expandedEventId) : null}
          </Collapse>
        </AccordionDetails>
      </Accordion>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="md">
        <DialogTitle>{isEditing ? 'Edit Event' : 'New Event'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="Event Name" value={form.eventName ?? ''} onChange={(e) => setForm({ ...form, eventName: e.target.value })} fullWidth />
            <TextField label="Description" value={form.description ?? ''} onChange={(e) => setForm({ ...form, description: e.target.value })} fullWidth multiline rows={3} />
            <Stack direction="row" spacing={2}>
              <TextField label="Min Age" value={form.minimumAge ?? ''} onChange={(e) => setForm({ ...form, minimumAge: e.target.value })} />
              <TextField label="Max Age" value={form.maximumAge ?? ''} onChange={(e) => setForm({ ...form, maximumAge: e.target.value })} />
              <TextField label="Entry Fee" value={form.entryFee ?? ''} onChange={(e) => setForm({ ...form, entryFee: e.target.value })} />
              <TextField label="Team Fee" value={form.entryFeeTeam ?? ''} onChange={(e) => setForm({ ...form, entryFeeTeam: e.target.value })} />
            </Stack>
            <TextField select label="Gender" value={form.gender ?? 'OPEN'} onChange={(e) => setForm({ ...form, gender: Gender[e.target.value.toUpperCase() as keyof typeof Gender]  })}>
              <MenuItem value={'OPEN'}>OPEN</MenuItem>
              <MenuItem value={'MEN'}>MEN</MenuItem>
              <MenuItem value={'WOMEN'}>WOMEN</MenuItem>
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={prizeDialogOpen} onClose={() => setPrizeDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{isPrizeEditing ? 'Edit Prize' : 'New Prize'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="Prize Name" value={prizeForm.prizeName ?? ''} onChange={(e) => setPrizeForm({ ...prizeForm, prizeName: e.target.value })} fullWidth />
            <TextField label="Cash Prize" value={prizeForm.cashPrizeValue ?? ''} onChange={(e) => setPrizeForm({ ...prizeForm, cashPrizeValue: e.target.value })} fullWidth />
            <TextField label="Trophy" value={prizeForm.trophyName ?? ''} onChange={(e) => setPrizeForm({ ...prizeForm, trophyName: e.target.value })} fullWidth />
            <TextField label="Ribbon" value={prizeForm.ribbonName ?? ''} onChange={(e) => setPrizeForm({ ...prizeForm, ribbonName: e.target.value })} fullWidth />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPrizeDialogOpen(false)}>Cancel</Button>
          <Button onClick={handlePrizeSave} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Grid>
  )
}
