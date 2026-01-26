'use client'

import { useState } from 'react'
import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid'
import { Accordion, AccordionDetails, AccordionSummary, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, MenuItem, Stack, TextField, Typography } from '@mui/material'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import Loading from '@app/Loading'
import { useSponsorshipPackages } from '@lib/queryHooks'
import { createSponsorshipPackage, deleteSponsorshipPackage, updateSponsorshipPackage } from '@lib/mutations'
import { SponsorshipPackageTier } from '@generated/enums'
import { SponsorshipPackageForm } from '../types'

export function SponsorshipPackagesTable(props: { title: string }) {
  const [refreshKey, setRefreshKey] = useState(0)
  const [packages, loading] = useSponsorshipPackages(refreshKey)
  const emptySelection: GridRowSelectionModel = { type: 'include', ids: new Set() }
  const [selection, setSelection] = useState<GridRowSelectionModel>(emptySelection)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [form, setForm] = useState<SponsorshipPackageForm>({
    id: -1,
    packageId: '',
    tier: SponsorshipPackageTier.SILVER,
    minimumAmount: '',
    maximumAmount: ''
  })

  const rows = packages.map((pkg, index) => ({
    id: index + 1,
    packageId: pkg.id,
    tier: pkg.tier,
    minimumAmount: pkg.minimumAmount ?? '',
    maximumAmount: pkg.maximumAmount ?? ''
  }))

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'tier', headerName: 'Tier', width: 150 },
    { field: 'minimumAmount', headerName: 'Minimum', width: 140 },
    { field: 'maximumAmount', headerName: 'Maximum', width: 140 }
  ]

  function openNew() {
    setIsEditing(false)
    setForm({
      id: -1,
      packageId: '',
      tier: SponsorshipPackageTier.SILVER,
      minimumAmount: '',
      maximumAmount: ''
    })
    setDialogOpen(true)
  }

  function openEdit() {
    const selectedIds = Array.from(selection.ids)
    if (selectedIds.length === 0) return
    const sel = rows.find((r) => r.id === selectedIds[0])
    if (!sel) return
    setIsEditing(true)
    setForm({
      id: sel.id,
      packageId: sel.packageId ? sel.packageId : '',
      tier: sel.tier as SponsorshipPackageTier,
      minimumAmount: sel.minimumAmount ?? '',
      maximumAmount: sel.maximumAmount ?? ''
    })
    setDialogOpen(true)
  }

  async function handleDelete() {
    const selectedIds = Array.from(selection.ids)
    if (selectedIds.length === 0) return
    const sel = rows.find((r) => r.id === selectedIds[0])
    if (!sel) return
    await deleteSponsorshipPackage(sel.packageId ? sel.packageId : '')
    setRefreshKey((prev) => prev + 1)
    setSelection(emptySelection)
  }

  async function handleSave() {
    try {
      const payload = {
        tier: form.tier,
        minimumAmount: Number(form.minimumAmount),
        maximumAmount: Number(form.maximumAmount)
      }
      if (isEditing && form.packageId) {
        await updateSponsorshipPackage(form.packageId, payload)
      } else {
        await createSponsorshipPackage(payload)
      }
      setDialogOpen(false)
      setRefreshKey((prev) => prev + 1)
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) {
    return (<Loading />)
  }

  return (
    <Grid size={12} spacing={2}>
      <Accordion>
        <AccordionSummary expandIcon={<ArrowDownwardIcon />}>
          <Typography>{props.title}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
            <Button variant="contained" onClick={openNew}>New Package</Button>
            <Button variant="outlined" onClick={openEdit} disabled={selection.ids.size !== 1}>Edit</Button>
            <Button variant="outlined" color="error" onClick={handleDelete} disabled={selection.ids.size !== 1}>Delete</Button>
          </Stack>
          <div style={{ height: 360, width: '100%' }}>
            <DataGrid
              rows={rows}
              columns={columns}
              pageSizeOptions={[5, 10]}
              checkboxSelection
              rowSelectionModel={selection}
              onRowSelectionModelChange={(newSelection: GridRowSelectionModel) => setSelection(newSelection)}
            />
          </div>
        </AccordionDetails>
      </Accordion>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{isEditing ? 'Edit Sponsorship Package' : 'New Sponsorship Package'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              select
              label="Tier"
              value={form.tier}
              onChange={(e) => setForm({ ...form, tier: e.target.value as SponsorshipPackageTier })}
              fullWidth
            >
              <MenuItem value={SponsorshipPackageTier.PLATNIUM}>PLATNIUM</MenuItem>
              <MenuItem value={SponsorshipPackageTier.GOLD}>GOLD</MenuItem>
              <MenuItem value={SponsorshipPackageTier.SILVER}>SILVER</MenuItem>
              <MenuItem value={SponsorshipPackageTier.BRONZE}>BRONZE</MenuItem>
              <MenuItem value={SponsorshipPackageTier.SECTION}>SECTION</MenuItem>
            </TextField>
            <TextField
              label="Minimum Amount"
              type="number"
              value={form.minimumAmount}
              onChange={(e) => setForm({ ...form, minimumAmount: e.target.value })}
              fullWidth
            />
            <TextField
              label="Maximum Amount"
              type="number"
              value={form.maximumAmount}
              onChange={(e) => setForm({ ...form, maximumAmount: e.target.value })}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Grid>
  )
}
