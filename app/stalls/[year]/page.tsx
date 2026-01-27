"use client"

import { use, useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import Content from "@components/Content";
import { Typography, Divider, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField, Grid, Card, CardHeader, CardContent, Paper } from "@mui/material";
import { StallApplicationForm } from "@components/StallApplicationForm";
import { authClient } from "@lib/auth-client";
import SignInPage from "@/app/signin/page";
import Waiting from "@/app/components/Waiting";
import { getShow, getStallInformation, getStallSiteCategories } from "@/app/lib/queries";
import type { StallInformation, StallSiteCategory } from "@/app/generated/prisma/browser";
import EditLock from "@/app/components/EditLock";
import RestrictedAccess from "@/app/components/Restricted";
import { updateStallInformation } from "@/app/lib/mutations";
import { StallSiteCategoriesTable } from "@/app/components/StallSiteCategoriesTable";

type StallInfoForm = {
  welcomeMessage: string
  insuranceDetails: string
  safetyGuidelines: string
  setupInstructions: string
  paymentDetails: string
  cancellationPolicy: string
  siteMap: string
  contactInformation: string
  thankyouMessage: string
}


export default function StallsYear({ params }: { params: Promise<{ year: string }> }) {
  const { year } = use(params)
  const session = authClient.useSession()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [loadingInfo, setLoadingInfo] = useState(true)
  const [stallInfo, setStallInfo] = useState<StallInformation | null>(null)
  const [stallCategories, setStallCategories] = useState<StallSiteCategory[]>([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const [showId, setShowId] = useState<string | null>(null)
  const [locked, setLocked] = useState(true)
  const [savingInfo, setSavingInfo] = useState(false)
  const [infoForm, setInfoForm] = useState<StallInfoForm>({
    welcomeMessage: "",
    insuranceDetails: "",
    safetyGuidelines: "",
    setupInstructions: "",
    paymentDetails: "",
    cancellationPolicy: "",
    siteMap: "",
    contactInformation: "",
    thankyouMessage: ""
  })

  useEffect(() => {
    let active = true
    async function fetchInfo() {
      try {
        setLoadingInfo(true)
        setCategoriesLoading(true)
        const show = await getShow(Number(year))
        if (!show) {
          if (active) setStallInfo(null)
          return
        }
        if (active) setShowId(show.id)
        const info = await getStallInformation(show.id)
        const categories = await getStallSiteCategories(show.id)
        if (active) {
          setStallInfo(info)
          setStallCategories(categories)
          setInfoForm({
            welcomeMessage: info?.welcomeMessage ?? "",
            insuranceDetails: info?.insuranceDetails ?? "",
            safetyGuidelines: info?.safetyGuidelines ?? "",
            setupInstructions: info?.setupInstructions ?? "",
            paymentDetails: info?.paymentDetails ?? "",
            cancellationPolicy: info?.cancellationPolicy ?? "",
            siteMap: info?.siteMap ?? "",
            contactInformation: info?.contactInformation ?? "",
            thankyouMessage: info?.thankyouMessage ?? ""
          })
        }
      } finally {
        if (active) setLoadingInfo(false)
        if (active) setCategoriesLoading(false)
      }
    }
    fetchInfo()
    return () => {
      active = false
    }
  }, [year])

  function normalize(value: string) {
    const trimmed = value.trim()
    return trimmed.length > 0 ? trimmed : null
  }

  async function handleSaveInfo() {
    if (!showId) return
    setSavingInfo(true)
    try {
      const updated = await updateStallInformation(showId, {
        welcomeMessage: normalize(infoForm.welcomeMessage),
        insuranceDetails: normalize(infoForm.insuranceDetails),
        safetyGuidelines: normalize(infoForm.safetyGuidelines),
        setupInstructions: normalize(infoForm.setupInstructions),
        paymentDetails: normalize(infoForm.paymentDetails),
        cancellationPolicy: normalize(infoForm.cancellationPolicy),
        siteMap: normalize(infoForm.siteMap),
        contactInformation: normalize(infoForm.contactInformation),
        thankyouMessage: normalize(infoForm.thankyouMessage)
      })
      setStallInfo(updated)
      setLocked(true)
    } finally {
      setSavingInfo(false)
    }
  }

  async function refreshCategories() {
    if (!showId) return
    setCategoriesLoading(true)
    try {
      const categories = await getStallSiteCategories(showId)
      setStallCategories(categories)
    } finally {
      setCategoriesLoading(false)
    }
  }

  return (
    <Content backgroundImageIndex={1}>
      <EditLock locked={locked} setLocked={setLocked} userFirstName={session.data?.user?.name} />
      <Waiting message="Loading session..." open={session.isPending || session.isRefetching} />
      <Typography variant="h3" color="primary.main" justifySelf="center">Stalls {year}</Typography>
      <Divider sx={{ my: 2 }} />
      {!locked ? (
        <RestrictedAccess explicit={false}>
          <Waiting message="Saving stall information..." open={savingInfo} />
          <Stack spacing={2} sx={{ mb: 3 }}>
            <Typography variant="h5" color="primary.main">Edit Stall Information</Typography>
            <TextField
              label="Welcome message"
              multiline
              minRows={3}
              value={infoForm.welcomeMessage}
              onChange={(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setInfoForm((prev) => ({ ...prev, welcomeMessage: event.target.value }))}
              fullWidth
            />
            <TextField
              label="Insurance details"
              multiline
              minRows={3}
              value={infoForm.insuranceDetails}
              onChange={(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setInfoForm((prev) => ({ ...prev, insuranceDetails: event.target.value }))}
              fullWidth
            />
            <TextField
              label="Safety guidelines"
              multiline
              minRows={3}
              value={infoForm.safetyGuidelines}
              onChange={(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setInfoForm((prev) => ({ ...prev, safetyGuidelines: event.target.value }))}
              fullWidth
            />
            <TextField
              label="Setup instructions"
              multiline
              minRows={3}
              value={infoForm.setupInstructions}
              onChange={(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setInfoForm((prev) => ({ ...prev, setupInstructions: event.target.value }))}
              fullWidth
            />
            <TextField
              label="Payment details"
              multiline
              minRows={3}
              value={infoForm.paymentDetails}
              onChange={(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setInfoForm((prev) => ({ ...prev, paymentDetails: event.target.value }))}
              fullWidth
            />
            <TextField
              label="Cancellation policy"
              multiline
              minRows={3}
              value={infoForm.cancellationPolicy}
              onChange={(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setInfoForm((prev) => ({ ...prev, cancellationPolicy: event.target.value }))}
              fullWidth
            />
            <TextField
              label="Site map"
              multiline
              minRows={3}
              value={infoForm.siteMap}
              onChange={(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setInfoForm((prev) => ({ ...prev, siteMap: event.target.value }))}
              fullWidth
            />
            <TextField
              label="Contact information"
              multiline
              minRows={3}
              value={infoForm.contactInformation}
              onChange={(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setInfoForm((prev) => ({ ...prev, contactInformation: event.target.value }))}
              fullWidth
            />
            <TextField
              label="Thank you message"
              multiline
              minRows={3}
              value={infoForm.thankyouMessage}
              onChange={(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setInfoForm((prev) => ({ ...prev, thankyouMessage: event.target.value }))}
              fullWidth
            />
            <Button variant="contained" onClick={handleSaveInfo} disabled={savingInfo || !showId}>Save stall information</Button>
          </Stack>
          <Divider sx={{ my: 2 }} />
        </RestrictedAccess>
      ) : null}

      {!locked ? (
        <RestrictedAccess explicit={true}>
          {showId ? (
            <Stack spacing={2} sx={{ mb: 3 }}>
              <Typography variant="h5" color="primary.main">Edit Stall Site Categories</Typography>
              <StallSiteCategoriesTable showId={showId} categories={stallCategories} onUpdated={refreshCategories} />
            </Stack>
          ) : null}
          <Divider sx={{ my: 2 }} />
        </RestrictedAccess>
      ) : null}
      {loadingInfo ? (
        <Waiting message="Loading stall information..." open={loadingInfo} />
      ) : stallInfo ? (
        <Stack spacing={2} sx={{ mb: 3 }}>
          {stallInfo.welcomeMessage ? 
          <Paper sx={{ p: 2, backgroundColor: "secondary.main" }} elevation={4}>
            <Typography variant="h5" color="primary.main">Stall Information</Typography>
            <Typography color="primary.main">{stallInfo.welcomeMessage}</Typography>
          </Paper> : null}
          <Divider/>
                {categoriesLoading ? (
        <Waiting message="Loading stall categories..." open={categoriesLoading} />
      ) : stallCategories.length ? (
          
        <>
          <Typography variant="h5" color="primary.main">Stall Site Categories</Typography>
          <Grid container spacing={2}>
          {stallCategories.map((category) => (
            <Grid size={{sm: 12, md: 6, lg: 4, xl: 3, xxl: 2}} key={category.id}>
              <Card sx={{ p: 2, backgroundColor: "secondary.main" }} elevation={4}>
                <Stack key={category.id} spacing={1} sx={{ p: 2, borderRadius: 2, backgroundColor: "secondary.main" }}>
                  <CardHeader title={category.name} sx={{color: "primary.main"}}/>
                  <CardContent>
                  {category.description ? (
                    <Stack spacing={0.5}>
                      {category.description
                        .split("\n")
                        .map((line) => line.trim())
                        .filter((line) => line.length > 0)
                        .map((line, index) => (
                          <Typography key={`${category.id}-item-${index}`} color="primary.main">
                            • {line}
                          </Typography>
                        ))}
                    </Stack>
                  ) : null}
                  <Typography color="primary.main">Size: {category.sizeWidth}m x {category.sizeDepth}m</Typography>
                  <Typography color="primary.main">Power supply: {category.powerSupply ? "Yes" : "No"}</Typography>
                  <Typography color="primary.main">Covered: {category.covered ? "Yes" : "No"}</Typography>
                  <Typography color="primary.main">Base price: ${category.basePrice.toFixed(2)}</Typography>
                  </CardContent>
                </Stack>
              </Card>
            </Grid>
          ))}
          
          </Grid>
          </>
      ) : null}
      <Divider/>
          {stallInfo.insuranceDetails ? 
          <Paper sx={{ p: 2, backgroundColor: "secondary.main" }} elevation={4}>
            <Typography variant="h5" color="primary.main">Insurance Requirements</Typography>
            <Typography color="primary.main" sx={{ whiteSpace: "pre-line" }}>{stallInfo.insuranceDetails}</Typography>
          </Paper> : null}
          <Divider/>
          {stallInfo.safetyGuidelines ? 
          <Paper sx={{ p: 2, backgroundColor: "secondary.main" }} elevation={4}>
            <Typography variant="h5" color="primary.main">Safety</Typography>
            <Typography color="primary.main" sx={{ whiteSpace: "pre-line" }}>{stallInfo.safetyGuidelines}</Typography>
          </Paper> : null}
          <Divider/>
          {stallInfo.setupInstructions ? 
          <Paper sx={{ p: 2, backgroundColor: "secondary.main" }} elevation={4}>
            <Typography variant="h5" color="primary.main">Setup Instructions</Typography>
            <Typography color="primary.main" sx={{ whiteSpace: "pre-line" }}>{stallInfo.setupInstructions}</Typography>
          </Paper> : null}
          <Divider/>
          {stallInfo.paymentDetails ?
          <Paper sx={{ p: 2, backgroundColor: "secondary.main" }} elevation={4}>
            <Typography variant="h5" color="primary.main">Payment Details</Typography>
            <Typography color="primary.main" sx={{ whiteSpace: "pre-line" }}>{stallInfo.paymentDetails}</Typography>
          </Paper> : null}
          <Divider/>
          {stallInfo.cancellationPolicy ? 
          <Paper sx={{ p: 2, backgroundColor: "secondary.main" }} elevation={4}>
            <Typography variant="h5" color="primary.main">Cancellation Policy</Typography>
            <Typography color="primary.main" sx={{ whiteSpace: "pre-line" }}>{stallInfo.cancellationPolicy}</Typography>
          </Paper> : null}
          <Divider/>
          {stallInfo.siteMap ? 
          <Paper sx={{ p: 2, backgroundColor: "secondary.main" }} elevation={4}>
            <Typography variant="h5" color="primary.main">Site Map</Typography>
            <Typography color="primary.main" sx={{ whiteSpace: "pre-line" }}>{stallInfo.siteMap}</Typography>
          </Paper> : null}
          <Divider/>
          {stallInfo.contactInformation ? 
          <Paper sx={{ p: 2, backgroundColor: "secondary.main" }} elevation={4}>
            <Typography variant="h5" color="primary.main">Contact Information</Typography>
            <Typography color="primary.main" sx={{ whiteSpace: "pre-line" }}>{stallInfo.contactInformation}</Typography>
          </Paper> : null}
          <Divider/>
          {stallInfo.thankyouMessage ? 
          <Paper sx={{ p: 2, backgroundColor: "secondary.main" }} elevation={4}>
            <Typography color="primary.main">{stallInfo.thankyouMessage}</Typography>
          </Paper> : null}
        </Stack>
      ) : null}
      <Button variant="contained" onClick={() => setDialogOpen(true)}>Apply for a Stall</Button>
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Stall Application</DialogTitle>
        <DialogContent>
          {!session.data && !session.isPending && !session.isRefetching ? (
            <SignInPage />
          ) : (
            <StallApplicationForm
              email={session.data?.user?.email}
              userName={session.data?.user?.name}
              showId={showId}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Content>
  )
}
