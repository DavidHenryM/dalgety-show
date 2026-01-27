import { useState } from 'react'
import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField, FormControlLabel, Switch } from '@mui/material'
import type { StallSiteCategory } from '@generated/browser'
import { createStallSiteCategory, deleteStallSiteCategory, updateStallSiteCategory } from '@lib/mutations'

type StallCategoryForm = {
  id?: string
  name: string
  description: string
  sizeWidth: string
  sizeDepth: string
  powerSupply: boolean
  covered: boolean
  basePrice: string
}

export function StallSiteCategoriesTable(props: { showId: string; categories: StallSiteCategory[]; onUpdated: () => void }) {
  const emptySelection: GridRowSelectionModel = { type: 'include', ids: new Set() }
  const [selection, setSelection] = useState<GridRowSelectionModel>(emptySelection)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [form, setForm] = useState<StallCategoryForm>({
    name: '',
    description: '',
    sizeWidth: '',
    sizeDepth: '',
    powerSupply: false,
    covered: false,
    basePrice: ''
  })

  const rows = props.categories.map((category, index) => ({
    id: index + 1,
    categoryId: category.id,
    name: category.name,
    description: category.description ?? '',
    sizeWidth: category.sizeWidth,
    sizeDepth: category.sizeDepth,
    powerSupply: category.powerSupply,
    covered: category.covered,
    basePrice: category.basePrice
  }))

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Name', width: 180 },
    { field: 'description', headerName: 'Description', width: 260 },
    { field: 'sizeWidth', headerName: 'Width (m)', width: 120 },
    { field: 'sizeDepth', headerName: 'Depth (m)', width: 120 },
    { field: 'powerSupply', headerName: 'Power', width: 110 },
    { field: 'covered', headerName: 'Covered', width: 110 },
    { field: 'basePrice', headerName: 'Base price', width: 140 }
  ]

  function openNew() {
    setIsEditing(false)
    setForm({
      name: '',
      description: '',
      sizeWidth: '',
      sizeDepth: '',
      powerSupply: false,
      covered: false,
      basePrice: ''
    })
    setDialogOpen(true)
  }

  function openEdit() {
    if (selection.ids.size === 0) return
    const sel = rows.find((row) => row.id === Array.from(selection.ids)[0])
    if (!sel) return
    setIsEditing(true)
    setForm({
      id: sel.categoryId,
      name: sel.name,
      description: sel.description,
      sizeWidth: sel.sizeWidth.toString(),
      sizeDepth: sel.sizeDepth.toString(),
      powerSupply: Boolean(sel.powerSupply),
      covered: Boolean(sel.covered),
      basePrice: sel.basePrice.toString()
    })
    setDialogOpen(true)
  }

  async function handleDelete() {
    if (selection.ids.size === 0) return
    const sel = rows.find((row) => row.id === Array.from(selection.ids)[0])
    if (!sel) return
    await deleteStallSiteCategory(sel.categoryId)
    setSelection(emptySelection)
    props.onUpdated()
  }

  async function handleSave() {
    const payload = {
      name: form.name,
      description: form.description || null,
      sizeWidth: Number(form.sizeWidth) || 0,
      sizeDepth: Number(form.sizeDepth) || 0,
      powerSupply: form.powerSupply,
      covered: form.covered,
      basePrice: Number(form.basePrice) || 0
    }

    if (isEditing && form.id) {
      await updateStallSiteCategory(form.id, payload)
    } else {
      await createStallSiteCategory({
        showId: props.showId,
        ...payload
      })
    }

    setDialogOpen(false)
    props.onUpdated()
  }

  return (
    <>
      <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
        <Button variant="contained" onClick={openNew}>New Category</Button>
        <Button variant="contained" onClick={openEdit} disabled={selection.ids.size !== 1}>Edit</Button>
        <Button variant="contained" color="error" onClick={handleDelete} disabled={selection.ids.size !== 1}>Delete</Button>
      </Stack>
      <div style={{ height: 420, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSizeOptions={[5, 10]}
          checkboxSelection
          onRowSelectionModelChange={(newSelection: GridRowSelectionModel) => setSelection(newSelection)}
        />
      </div>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="md">
        <DialogTitle>{isEditing ? 'Edit Category' : 'New Category'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="Name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} fullWidth />
            <TextField
              label="Description"
              value={form.description}
              onChange={(event) => setForm({ ...form, description: event.target.value })}
              fullWidth
              multiline
              minRows={2}
            />
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <TextField label="Width (m)" value={form.sizeWidth} onChange={(event) => setForm({ ...form, sizeWidth: event.target.value })} fullWidth />
              <TextField label="Depth (m)" value={form.sizeDepth} onChange={(event) => setForm({ ...form, sizeDepth: event.target.value })} fullWidth />
              <TextField label="Base price" value={form.basePrice} onChange={(event) => setForm({ ...form, basePrice: event.target.value })} fullWidth />
            </Stack>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <FormControlLabel
                control={<Switch checked={form.powerSupply} onChange={(event) => setForm({ ...form, powerSupply: event.target.checked })} />}
                label="Power supply"
              />
              <FormControlLabel
                control={<Switch checked={form.covered} onChange={(event) => setForm({ ...form, covered: event.target.checked })} />}
                label="Covered"
              />
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
