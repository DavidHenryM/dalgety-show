'use client'

import { useState } from 'react'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { Accordion, AccordionDetails, AccordionSummary, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, MenuItem, Stack, TextField, Typography } from '@mui/material'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import Loading from '@app/Loading'
import { useMembershipPackages } from '@lib/queryHooks'
import { createMembershipPackage, deleteMembershipPackage, updateMembershipPackage } from '@lib/mutations'
import { MembershipType } from '@generated/enums'
import { MembershipPackageForm } from '../types'
import { simpleDateString } from '@app/utils'

export function MembershipPackagesTable(props: { title: string }) {
  const [refreshKey, setRefreshKey] = useState(0)
  const [packages, loading] = useMembershipPackages(refreshKey)
  const [selection, setSelection] = useState<number[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [form, setForm] = useState<MembershipPackageForm>({
    id: -1,
    packageId: '',
    type: MembershipType.INDIVIDUAL,
    cost: '',
    validFrom: '',
    validTo: '',
    termDays: ''
  })

  const rows = packages.map((pkg, index) => ({
    id: index + 1,
    packageId: pkg.id,
    type: pkg.type,
    cost: pkg.cost,
    validFrom: pkg.validFrom ? simpleDateString(new Date(pkg.validFrom)) : '',
    validTo: pkg.validTo ? simpleDateString(new Date(pkg.validTo)) : '',
    termDays: pkg.termDays
  }))

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'type', headerName: 'Type', width: 140 },
    { field: 'cost', headerName: 'Cost', width: 120 },
    { field: 'validFrom', headerName: 'Valid From', width: 140 },
    { field: 'validTo', headerName: 'Valid To', width: 140 },
    { field: 'termDays', headerName: 'Term (days)', width: 120 }
  ]

  function openNew() {
    setIsEditing(false)
    setForm({
      id: -1,
      packageId: '',
      type: MembershipType.INDIVIDUAL,
      cost: '',
      validFrom: '',
      validTo: '',
      termDays: ''
    })
    setDialogOpen(true)
  }

  function openEdit() {
    if (selection.length === 0) return
    const sel = rows.find((r) => r.id === selection[0])
    if (!sel) return
    setIsEditing(true)
    setForm({
      id: sel.id,
      packageId: sel.packageId,
      type: sel.type,
      cost: sel.cost ?? '',
      validFrom: sel.validFrom ?? '',
      validTo: sel.validTo ?? '',
      termDays: sel.termDays ?? ''
    })
    setDialogOpen(true)
  }

  async function handleDelete() {
    if (selection.length === 0) return
    const sel = rows.find((r) => r.id === selection[0])
    if (!sel) return
    await deleteMembershipPackage(sel.packageId)
    setRefreshKey((prev) => prev + 1)
    setSelection([])
  }

  async function handleSave() {
    try {
      const payload = {
        type: form.type,
        cost: Number(form.cost),
        validFrom: new Date(form.validFrom),
        validTo: form.validTo ? new Date(form.validTo) : null,
        termDays: Number(form.termDays)
      }
      if (isEditing && form.packageId) {
        await updateMembershipPackage(form.packageId, payload)
      } else {
        await createMembershipPackage(payload)
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
            <Button variant="contained" onClick={openEdit} disabled={selection.length !== 1}>Edit</Button>
            <Button variant="contained" color="error" onClick={handleDelete} disabled={selection.length !== 1}>Delete</Button>
          </Stack>
          <div style={{ height: 360, width: '100%' }}>
            <DataGrid
              rows={rows}
              columns={columns}
              pageSizeOptions={[5, 10]}
              checkboxSelection
              onRowSelectionModelChange={(newSelection: unknown) => setSelection(newSelection as number[])}
            />
          </div>
        </AccordionDetails>
      </Accordion>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{isEditing ? 'Edit Membership Package' : 'New Membership Package'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              select
              label="Type"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value as MembershipType })}
              fullWidth
            >
              <MenuItem value={MembershipType.INDIVIDUAL}>INDIVIDUAL</MenuItem>
              <MenuItem value={MembershipType.FAMILY}>FAMILY</MenuItem>
            </TextField>
            <TextField
              label="Cost"
              type="number"
              value={form.cost}
              onChange={(e) => setForm({ ...form, cost: e.target.value })}
              fullWidth
            />
            <TextField
              label="Valid From"
              type="date"
              value={form.validFrom}
              onChange={(e) => setForm({ ...form, validFrom: e.target.value })}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <TextField
              label="Valid To"
              type="date"
              value={form.validTo}
              onChange={(e) => setForm({ ...form, validTo: e.target.value })}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <TextField
              label="Term Days"
              type="number"
              value={form.termDays}
              onChange={(e) => setForm({ ...form, termDays: e.target.value })}
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
