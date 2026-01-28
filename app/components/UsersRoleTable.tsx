"use client"

import { useState } from 'react'
import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid'
import { Accordion, AccordionDetails, AccordionSummary, Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Stack, TextField, Typography } from '@mui/material'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import { OfficialRole, Role, State } from '../generated/prisma/enums';
import { useUsersWithRole } from '../lib/queryHooks';
import { createUser, deleteUser, updateUser } from '../lib/mutations';
import Loading from '../Loading';
import { Snack } from './Alert';

export function UsersRoleTable(props: {title: string, role: Role}){
  const [refreshKey, setRefreshKey] = useState(0)
  const [users, loading] = useUsersWithRole(props.role, refreshKey)
  const emptySelection: GridRowSelectionModel = { type: 'include', ids: new Set() }
  const [selection, setSelection] = useState<GridRowSelectionModel>(emptySelection)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [alertOpen, setAlertOpen] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const [alertSeverity, setAlertSeverity] = useState<'success' | 'error'>('success')
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    userId: '',
    email: '',
    firstName: '',
    lastName: '',
    role: props.role as Role,
    officialRole: '' as '' | OfficialRole,
    mobileNumber: '',
    landlineNumber: '',
    billingUnit: '',
    billingStreetNumber: '',
    billingStreetName: '',
    billingStreetType: '',
    billingSuburb: '',
    billingState: '' as '' | State,
    billingCountry: '',
    billingPostCode: '',
    shippingUnit: '',
    shippingStreetNumber: '',
    shippingStreetName: '',
    shippingStreetType: '',
    shippingSuburb: '',
    shippingState: '' as '' | State,
    shippingCountry: '',
    shippingPostCode: ''
  })

  function formatAddress(address?: { unit?: number | null; streetNumber?: number | null; streetName?: string | null; streetType?: string | null; suburb?: string | null; state?: string | null; country?: string | null; postCode?: number | null }){
    if (!address) return ''
    const unit = address.unit ? `${address.unit}/` : ''
    const streetNumber = address.streetNumber ? address.streetNumber.toString() : ''
    const streetName = address.streetName ?? ''
    const streetType = address.streetType ?? ''
    const suburb = address.suburb ?? ''
    const state = address.state ?? ''
    const postCode = address.postCode ? address.postCode.toString() : ''
    const country = address.country ?? ''
    return `${unit}${streetNumber} ${streetName} ${streetType}, ${suburb} ${state} ${postCode}, ${country}`.trim()
  }

  function buildName(firstName: string, lastName: string): string {
    return `${firstName} ${lastName}`
  }

  const usersWithId = users.map((user, index) => ({
    ...user, // Spread existing properties
    id: index+1, // Add new property
    userId: user.id,
    officialRoleLabel: user.officialRole?.replaceAll("_"," ")
    ,billingAddressLabel: user.billingAddress ? formatAddress(user.billingAddress as unknown as Record<string, unknown>) : ''
    ,shippingAddressLabel: user.shippingAddress ? formatAddress(user.shippingAddress as unknown as Record<string, unknown>) : ''
    ,organisationsLabel: user.organisation?.map((org: { name?: string }) => org.name).filter(Boolean).join(', ')
    ,chiefStewardLabel: user.chiefStewardOfEventSections?.map((sec: { name?: string; letter?: string | null }) => sec.letter ? `${sec.letter} ${sec.name}` : sec.name).filter(Boolean).join(', ')
    ,eventResultsLabel: user.eventResults ? String(user.eventResults.length) : '0'
  }));

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'firstName', headerName: 'First name', width: 130 },
    { field: 'lastName', headerName: 'Last name', width: 130 },
    { field: 'email', headerName: 'Email', width: 240 },
    { field: 'officialRoleLabel', headerName: 'Official Role', width: 240 },
    { field: 'role', headerName: 'Role', width: 130 },
    { field: 'mobileNumber', headerName: 'Mobile', width: 160 },
    { field: 'landlineNumber', headerName: 'Landline', width: 160 },
    { field: 'shippingAddressLabel', headerName: 'Shipping Address', width: 320 },
    { field: 'billingAddressLabel', headerName: 'Billing Address', width: 320 },
    { field: 'organisationsLabel', headerName: 'Organisations', width: 240 },
    { field: 'chiefStewardLabel', headerName: 'Chief Steward of Section', width: 260 },
    { field: 'eventResultsLabel', headerName: 'Event Results', width: 140 },
  ]

  function openNew(){
    setIsEditing(false)
    setForm({
      userId: '',
      email: '',
      firstName: '',
      lastName: '',
      role: props.role,
      officialRole: '',
      mobileNumber: '',
      landlineNumber: '',
      billingUnit: '',
      billingStreetNumber: '',
      billingStreetName: '',
      billingStreetType: '',
      billingSuburb: '',
      billingState: '',
      billingCountry: '',
      billingPostCode: '',
      shippingUnit: '',
      shippingStreetNumber: '',
      shippingStreetName: '',
      shippingStreetType: '',
      shippingSuburb: '',
      shippingState: '',
      shippingCountry: '',
      shippingPostCode: ''
    })
    setDialogOpen(true)
  }

  function openEdit(){
    const selectedIds = Array.from(selection.ids)
    if (selectedIds.length === 0) return
    const sel = usersWithId.find(r => r.id === selectedIds[0])
    if (!sel) return
    setIsEditing(true)
    setForm({
      userId: (sel.userId ?? '') as string,
      email: sel.email ?? '',
      firstName: sel.firstName ?? '',
      lastName: sel.lastName ?? '',
      role: (sel.role ?? props.role) as Role,
      officialRole: (sel.officialRole ? (sel.officialRole as OfficialRole) : ''),
      mobileNumber: sel.mobileNumber ?? '',
      landlineNumber: sel.landlineNumber ?? '',
      billingUnit: sel.billingAddress?.unit?.toString() ?? '',
      billingStreetNumber: sel.billingAddress?.streetNumber?.toString() ?? '',
      billingStreetName: sel.billingAddress?.streetName ?? '',
      billingStreetType: sel.billingAddress?.streetType ?? '',
      billingSuburb: sel.billingAddress?.suburb ?? '',
      billingState: (sel.billingAddress?.state as State) ?? '',
      billingCountry: sel.billingAddress?.country ?? '',
      billingPostCode: sel.billingAddress?.postCode?.toString() ?? '',
      shippingUnit: sel.shippingAddress?.unit?.toString() ?? '',
      shippingStreetNumber: sel.shippingAddress?.streetNumber?.toString() ?? '',
      shippingStreetName: sel.shippingAddress?.streetName ?? '',
      shippingStreetType: sel.shippingAddress?.streetType ?? '',
      shippingSuburb: sel.shippingAddress?.suburb ?? '',
      shippingState: (sel.shippingAddress?.state as State) ?? '',
      shippingCountry: sel.shippingAddress?.country ?? '',
      shippingPostCode: sel.shippingAddress?.postCode?.toString() ?? ''
    })
    setDialogOpen(true)
  }

  async function handleDelete(){
    const selectedIds = Array.from(selection.ids)
    if (selectedIds.length === 0) return
    const sel = usersWithId.find(r => r.id === selectedIds[0])
    if (!sel || !sel.userId) return
    try {
      await deleteUser(sel.userId as string)
      setAlertSeverity('success')
      setAlertMessage('User deleted successfully.')
      setAlertOpen(true)
      setRefreshKey(prev => prev + 1)
      setSelection(emptySelection)
    } catch (err){
      console.error(err)
      setAlertSeverity('error')
      setAlertMessage('Error deleting the user. Please try again.')
      setAlertOpen(true)
    }
  }

  async function handleSave(){
    try {
      setSaving(true)
      const computedName = buildName(form.firstName, form.lastName)
      const hasName = computedName.trim().length > 0
      if (isEditing) {
        if (!form.userId) return
        await updateUser(form.userId, {
          email: form.email,
          ...(computedName ? { name: computedName } : {}),
          firstName: form.firstName || null,
          lastName: form.lastName || null,
          role: form.role,
          officialRole: form.officialRole || null,
          mobileNumber: form.mobileNumber || null,
          landlineNumber: form.landlineNumber || null,
          billingAddress: form.billingStreetNumber && form.billingStreetName && form.billingStreetType && form.billingSuburb && form.billingState && form.billingCountry && form.billingPostCode ? {
            unit: form.billingUnit ? Number(form.billingUnit) : null,
            streetNumber: Number(form.billingStreetNumber),
            streetName: form.billingStreetName,
            streetType: form.billingStreetType,
            suburb: form.billingSuburb,
            state: form.billingState as State,
            country: form.billingCountry,
            postCode: Number(form.billingPostCode)
          } : null,
          shippingAddress: form.shippingStreetNumber && form.shippingStreetName && form.shippingStreetType && form.shippingSuburb && form.shippingState && form.shippingCountry && form.shippingPostCode ? {
            unit: form.shippingUnit ? Number(form.shippingUnit) : null,
            streetNumber: Number(form.shippingStreetNumber),
            streetName: form.shippingStreetName,
            streetType: form.shippingStreetType,
            suburb: form.shippingSuburb,
            state: form.shippingState as State,
            country: form.shippingCountry,
            postCode: Number(form.shippingPostCode)
          } : null
        })
        setAlertSeverity('success')
        setAlertMessage('User updated successfully.')
        setAlertOpen(true)
      } else {
        if (!form.email || !hasName) return
        await createUser({
          email: form.email,
          name: computedName,
          firstName: form.firstName || null,
          lastName: form.lastName || null,
          role: form.role,
          officialRole: form.officialRole || null,
          mobileNumber: form.mobileNumber || null,
          landlineNumber: form.landlineNumber || null,
          billingAddress: form.billingStreetNumber && form.billingStreetName && form.billingStreetType && form.billingSuburb && form.billingState && form.billingCountry && form.billingPostCode ? {
            unit: form.billingUnit ? Number(form.billingUnit) : null,
            streetNumber: Number(form.billingStreetNumber),
            streetName: form.billingStreetName,
            streetType: form.billingStreetType,
            suburb: form.billingSuburb,
            state: form.billingState as State,
            country: form.billingCountry,
            postCode: Number(form.billingPostCode)
          } : null,
          shippingAddress: form.shippingStreetNumber && form.shippingStreetName && form.shippingStreetType && form.shippingSuburb && form.shippingState && form.shippingCountry && form.shippingPostCode ? {
            unit: form.shippingUnit ? Number(form.shippingUnit) : null,
            streetNumber: Number(form.shippingStreetNumber),
            streetName: form.shippingStreetName,
            streetType: form.shippingStreetType,
            suburb: form.shippingSuburb,
            state: form.shippingState as State,
            country: form.shippingCountry,
            postCode: Number(form.shippingPostCode)
          } : null
        })
        setAlertSeverity('success')
        setAlertMessage('User created successfully.')
        setAlertOpen(true)
      }
      setDialogOpen(false)
      setRefreshKey(prev => prev + 1)
      setSelection(emptySelection)
    } catch (err){
      console.error(err)
      setAlertSeverity('error')
      setAlertMessage('Error saving the user. Please try again.')
      setAlertOpen(true)
    } finally {
      setSaving(false)
    }
  }

  if (loading){
    return (<Loading />)
  }

  return (
    <>
      <Accordion>
        <AccordionSummary expandIcon={<ArrowDownwardIcon />}>
          <Typography component="span">{props.title}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
            <Button variant="contained" onClick={openNew}>New</Button>
            <Button variant="contained" onClick={openEdit} disabled={selection.ids.size !== 1}>Edit</Button>
            <Button variant="contained" color="error" onClick={handleDelete} disabled={selection.ids.size !== 1}>Delete</Button>
          </Stack>
          <div style={{ height: 360, width: '100%' }}>
            <DataGrid
              rows={usersWithId}
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
        <DialogTitle>{isEditing ? 'Edit User' : 'Create User'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="Email" value={form.email} onChange={(e)=>setForm({...form, email: e.target.value})} fullWidth />
            <TextField label="First Name" value={form.firstName} onChange={(e)=>setForm({...form, firstName: e.target.value})} fullWidth />
            <TextField label="Last Name" value={form.lastName} onChange={(e)=>setForm({...form, lastName: e.target.value})} fullWidth />
            <TextField label="Mobile Number" value={form.mobileNumber} onChange={(e)=>setForm({...form, mobileNumber: e.target.value})} fullWidth />
            <TextField label="Landline Number" value={form.landlineNumber} onChange={(e)=>setForm({...form, landlineNumber: e.target.value})} fullWidth />
            <TextField select label="Role" value={form.role} onChange={(e)=>setForm({...form, role: e.target.value as Role})} fullWidth>
              <MenuItem value={Role.USER}>USER</MenuItem>
              <MenuItem value={Role.OWNER}>OWNER</MenuItem>
              <MenuItem value={Role.SITE_ADMIN}>SITE_ADMIN</MenuItem>
            </TextField>
            <TextField
              select
              label="Official Role"
              value={form.officialRole}
              onChange={(e)=>setForm({...form, officialRole: e.target.value as OfficialRole | ''})}
              fullWidth
            >
              <MenuItem value={''}>None</MenuItem>
              <MenuItem value={OfficialRole.PRESIDENT}>PRESIDENT</MenuItem>
              <MenuItem value={OfficialRole.VICE_PRESIDENT}>VICE_PRESIDENT</MenuItem>
              <MenuItem value={OfficialRole.SECRETARY}>SECRETARY</MenuItem>
              <MenuItem value={OfficialRole.ENTRY_SECRETARY}>ENTRY_SECRETARY</MenuItem>
              <MenuItem value={OfficialRole.TREASURER}>TREASURER</MenuItem>
              <MenuItem value={OfficialRole.PUBLICITY_OFFICER}>PUBLICITY_OFFICER</MenuItem>
              <MenuItem value={OfficialRole.STALL_COORDINATOR}>STALL_COORDINATOR</MenuItem>
            </TextField>
            <Typography variant="subtitle1">Billing Address</Typography>
            <Stack direction="row" spacing={2}>
              <TextField label="Unit" value={form.billingUnit} onChange={(e)=>setForm({...form, billingUnit: e.target.value})} />
              <TextField label="Street Number" value={form.billingStreetNumber} onChange={(e)=>setForm({...form, billingStreetNumber: e.target.value})} />
              <TextField label="Street Name" value={form.billingStreetName} onChange={(e)=>setForm({...form, billingStreetName: e.target.value})} />
            </Stack>
            <Stack direction="row" spacing={2}>
              <TextField label="Street Type" value={form.billingStreetType} onChange={(e)=>setForm({...form, billingStreetType: e.target.value})} />
              <TextField label="Suburb" value={form.billingSuburb} onChange={(e)=>setForm({...form, billingSuburb: e.target.value})} />
              <TextField select label="State" value={form.billingState} onChange={(e)=>setForm({...form, billingState: e.target.value as State | ''})}>
                <MenuItem value={''}>Select</MenuItem>
                {Object.values(State).map((st) => (
                  <MenuItem key={st} value={st}>{st}</MenuItem>
                ))}
              </TextField>
            </Stack>
            <Stack direction="row" spacing={2}>
              <TextField label="Post Code" value={form.billingPostCode} onChange={(e)=>setForm({...form, billingPostCode: e.target.value})} />
              <TextField label="Country" value={form.billingCountry} onChange={(e)=>setForm({...form, billingCountry: e.target.value})} />
            </Stack>
            <Typography variant="subtitle1">Shipping Address</Typography>
            <Stack direction="row" spacing={2}>
              <TextField label="Unit" value={form.shippingUnit} onChange={(e)=>setForm({...form, shippingUnit: e.target.value})} />
              <TextField label="Street Number" value={form.shippingStreetNumber} onChange={(e)=>setForm({...form, shippingStreetNumber: e.target.value})} />
              <TextField label="Street Name" value={form.shippingStreetName} onChange={(e)=>setForm({...form, shippingStreetName: e.target.value})} />
            </Stack>
            <Stack direction="row" spacing={2}>
              <TextField label="Street Type" value={form.shippingStreetType} onChange={(e)=>setForm({...form, shippingStreetType: e.target.value})} />
              <TextField label="Suburb" value={form.shippingSuburb} onChange={(e)=>setForm({...form, shippingSuburb: e.target.value})} />
              <TextField select label="State" value={form.shippingState} onChange={(e)=>setForm({...form, shippingState: e.target.value as State | ''})}>
                <MenuItem value={''}>Select</MenuItem>
                {Object.values(State).map((st) => (
                  <MenuItem key={st} value={st}>{st}</MenuItem>
                ))}
              </TextField>
            </Stack>
            <Stack direction="row" spacing={2}>
              <TextField label="Post Code" value={form.shippingPostCode} onChange={(e)=>setForm({...form, shippingPostCode: e.target.value})} />
              <TextField label="Country" value={form.shippingCountry} onChange={(e)=>setForm({...form, shippingCountry: e.target.value})} />
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" disabled={saving}>
            {saving ? 'SAVING...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
      <Snack message={alertMessage} open={alertOpen} setOpen={setAlertOpen} severity={alertSeverity} />
    </>
  )
}