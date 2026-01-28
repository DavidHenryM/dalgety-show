import { useState } from 'react'
import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid'
import { Accordion, AccordionDetails, AccordionSummary, Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Stack, TextField, Typography } from '@mui/material'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import Waiting from './Waiting'
import { useStallApplications } from '../lib/queryHooks'
import { simpleDateString } from '../utils'
import { assignStallSiteToApplication } from '@lib/mutations'
import { getStallSitesByCategory } from '@lib/queries'
import type { StallSite } from '@generated/browser'

export function StallApplicationsTable(props: { title: string }) {
  const [refreshKey, setRefreshKey] = useState(0)
  const [applications, loading] = useStallApplications(refreshKey)
  const emptySelection: GridRowSelectionModel = { type: 'include', ids: new Set() }
  const [selection, setSelection] = useState<GridRowSelectionModel>(emptySelection)
  const [assignOpen, setAssignOpen] = useState(false)
  const [assigning, setAssigning] = useState(false)
  const [stallSites, setStallSites] = useState<StallSite[]>([])
  const [selectedStallSiteId, setSelectedStallSiteId] = useState('')

  const rows = applications.map((application, index) => ({
    id: index + 1,
    applicationId: application.id,
    categoryId: application.stallSiteCategoryId,
    applicantName: [application.applicant.firstName, application.applicant.lastName].filter(Boolean).join(' '),
    email: application.applicant.email,
    organisation: application.organisation?.name ?? 'N/A',
    category: application.stallSiteCategory?.name ?? 'N/A',
    assignedSites: application.stallSites.map((site) => site.siteNumber).join(', '),
    preferredLocation: application.preferredLocation,
    items: application.itemsToBeSoldOrDisplayed,
    applicationDate: simpleDateString(application.applicationDate),
    approved: application.approved ? 'Yes' : 'No',
    approvedDate: application.approvedDate ? simpleDateString(application.approvedDate) : 'Pending',
    stallSetupImageLink: application.stallSetupImageLink ?? '',
    publicLiabilityInsuranceLink: application.publicLiabilityInsuranceLink ?? ''
  }))

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'applicantName', headerName: 'Applicant', width: 180 },
    { field: 'email', headerName: 'Email', width: 240 },
    { field: 'organisation', headerName: 'Organisation', width: 180 },
    { field: 'category', headerName: 'Category', width: 180 },
    { field: 'assignedSites', headerName: 'Assigned Sites', width: 160 },
    { field: 'preferredLocation', headerName: 'Preferred Location', width: 200 },
    { field: 'items', headerName: 'Items', width: 260 },
    { field: 'applicationDate', headerName: 'Applied', width: 160 },
    { field: 'approved', headerName: 'Approved', width: 120 },
    { field: 'approvedDate', headerName: 'Approved Date', width: 160 },
    { field: 'stallSetupImageLink', headerName: 'Setup Image', width: 240 },
    { field: 'publicLiabilityInsuranceLink', headerName: 'Insurance Proof', width: 240 }
  ]

  function openAssignDialog() {
    if (selection.ids.size === 0) return
    const sel = rows.find((row) => row.id === Array.from(selection.ids)[0])
    if (!sel) return
    setSelectedStallSiteId('')
    setAssignOpen(true)
    getStallSitesByCategory(sel.categoryId).then((sites) => {
      setStallSites(sites)
      if (sites.length) {
        setSelectedStallSiteId(sites[0].id)
      }
    })
  }

  async function handleAssign() {
    if (selection.ids.size === 0 || !selectedStallSiteId) return
    const sel = rows.find((row) => row.id === Array.from(selection.ids)[0])
    if (!sel) return
    setAssigning(true)
    try {
      await assignStallSiteToApplication(selectedStallSiteId, sel.applicationId)
      setAssignOpen(false)
      setRefreshKey((prev) => prev + 1)
      setSelection(emptySelection)
    } finally {
      setAssigning(false)
    }
  }

  return (
    <>
      <Waiting message="loading stall applications" open={loading} />
      <Accordion>
        <AccordionSummary expandIcon={<ArrowDownwardIcon />}>
          <Typography component="span">{props.title}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
            <Button variant="contained" onClick={openAssignDialog} disabled={selection.ids.size !== 1}>Assign Stall Site</Button>
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
        </AccordionDetails>
      </Accordion>

      <Dialog open={assignOpen} onClose={() => setAssignOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Assign Stall Site</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Stall Site"
              select
              value={selectedStallSiteId}
              onChange={(event) => setSelectedStallSiteId(event.target.value)}
              fullWidth
            >
              {stallSites.map((site) => (
                <MenuItem key={site.id} value={site.id}>
                  {`Site ${site.siteNumber}`}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAssignOpen(false)}>Cancel</Button>
          <Button onClick={handleAssign} variant="contained" disabled={!selectedStallSiteId || assigning}>Assign</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
