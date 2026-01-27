"use client"

import { Button, Divider, Grid, MenuItem, TextField, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import Waiting from "./Waiting";
import { AlertDialog } from "./Alert";
import { createStallApplication, emailOfficialRole } from "../lib/mutations";
import { OfficialRole } from "../generated/prisma/enums";
import type { StallSiteCategory } from "../generated/prisma/browser";
import { getStallSiteCategories, getUserFromEmail } from "../lib/queries";

type StallInputs = {
  firstName: string
  lastName: string
  organisation: string
  phone: string
  categoryId: string
  preferredLocation: string
  items: string
  layoutFeatures: string
  notes: string
  stallImage?: FileList
  insuranceProof?: FileList
}

export function StallApplicationForm(props: { email: string | null | undefined; userName?: string | null; showId?: string | null }) {
  const [submitting, setSubmitting] = useState(false)
  const [alertOpen, setAlertOpen] = useState(false)
  const [alertTitle, setAlertTitle] = useState("")
  const [alertMessage, setAlertMessage] = useState("")
  const [categories, setCategories] = useState<StallSiteCategory[]>([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const defaultValues = useMemo(() => {
    const nameParts = (props.userName ?? "").trim().split(" ")
    const firstName = nameParts[0] ?? ""
    const lastName = nameParts.slice(1).join(" ")
    return {
      firstName,
      lastName,
      organisation: "",
      phone: "",
      categoryId: "",
      preferredLocation: "",
      items: "",
      layoutFeatures: "",
      notes: ""
    }
  }, [props.userName])
  const form = useForm<StallInputs>({ defaultValues })

  useEffect(() => {
    form.reset(defaultValues)
  }, [defaultValues, form])

  useEffect(() => {
    let active = true
    async function loadPrefill() {
      try {
        setCategoriesLoading(true)
        if (!props.showId) {
          setCategories([])
          return
        }
        const categoryList = await getStallSiteCategories(props.showId)
        if (active) {
          setCategories(categoryList)
          if (categoryList.length && !form.getValues("categoryId")) {
            form.setValue("categoryId", categoryList[0].id)
          }
        }
      } finally {
        if (active) {
          setCategoriesLoading(false)
        }
      }
    }
    loadPrefill()
    return () => {
      active = false
    }
  }, [form, props.showId])

  useEffect(() => {
    let active = true
    async function loadUserPrefill() {
      if (!props.email) return
      const user = await getUserFromEmail(props.email)
      if (!user || !active) return
      if (user.firstName) form.setValue("firstName", user.firstName)
      if (user.lastName) form.setValue("lastName", user.lastName)
      const phone = user.mobileNumber ?? user.landlineNumber
      if (phone) form.setValue("phone", phone)
    }
    loadUserPrefill()
    return () => {
      active = false
    }
  }, [props.email, form])

  async function uploadFile(kind: "stall-image" | "insurance", file?: File) {
    if (!file) return undefined
    const formData = new FormData()
    formData.append("file", file)
    formData.append("kind", kind)
    const res = await fetch("/api/stalls/upload", {
      method: "POST",
      body: formData
    })
    if (!res.ok) {
      const payload = await res.json().catch(() => ({}))
      throw new Error(payload?.error || "Upload failed")
    }
    const payload = await res.json()
    return payload?.url as string | undefined
  }

  const onSubmit: SubmitHandler<StallInputs> = async (data) => {
    setSubmitting(true)
    const email = props.email ? props.email : ""
    try {
      const stallImageFile = data.stallImage?.[0]
      const insuranceProofFile = data.insuranceProof?.[0]
      const [stallImageUrl, insuranceProofUrl] = await Promise.all([
        uploadFile("stall-image", stallImageFile),
        uploadFile("insurance", insuranceProofFile)
      ])
      if (!data.categoryId) {
        throw new Error("Please select a stall category")
      }

      const selectedCategory = categories.find((category) => category.id === data.categoryId)
      const stallApplication = await createStallApplication({
        email,
        organisationName: data.organisation,
        stallSiteCategoryId: data.categoryId,
        preferredLocation: data.preferredLocation,
        itemsToBeSoldOrDisplayed: data.items,
        layoutOrSpecialFeatures: data.layoutFeatures,
        stallSetupImageLink: stallImageUrl,
        publicLiabilityInsuranceLink: insuranceProofUrl,
        notes: data.notes
      })

      const message = [
        `New stall application received.`,
        `Application ID: ${stallApplication.id}`,
        `Name: ${data.firstName} ${data.lastName}`,
        `Email: ${email}`,
        `Organisation: ${data.organisation}`,
        `Phone: ${data.phone}`,
        `Category: ${selectedCategory?.name ?? data.categoryId}`,
        `Preferred location: ${data.preferredLocation}`,
        `Items: ${data.items}`,
        `Layout/special features: ${data.layoutFeatures}`,
        `Additional notes: ${data.notes}`,
        `Stall image: ${stallImageUrl ?? "(not provided)"}`,
        `Insurance proof: ${insuranceProofUrl ?? "(not provided)"}`
      ].join("\n")

      await emailOfficialRole({
        role: OfficialRole.STALL_COORDINATOR,
        subject: "New stall application",
        text: message
      })

      setAlertTitle("Stall application submitted successfully")
      setAlertMessage("We've received your application and will be in touch shortly.")
      setAlertOpen(true)
      form.reset(defaultValues)
    } catch (err) {
      setAlertTitle("Error submitting stall application")
      setAlertMessage(err instanceof Error ? err.message : "Something went wrong")
      setAlertOpen(true)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Waiting open={submitting} message={"Submitting your stall application"} />
      <Grid container spacing={2} sx={{ margin: 2, justifySelf: "center" }}>
        <Grid size={12} spacing={2} p={2} sx={{ justifyItems: "center" }}>
          <Typography variant="h4" color="primary">Apply for a Stall</Typography>
        </Grid>
        <Divider />
        {props.email ? (
          <Grid size={{ xs: 12, sm: 12, md: 12, lg: 6, xl: 12 }}>
            <TextField
              id="outlined-read-only-input"
              slotProps={{
                input: {
                  readOnly: true,
                }
              }}
              value={props.email}
              sx={{ minWidth: "300px" }}
              disabled={true}
            />
          </Grid>
        ) : null}
        <Grid size={{ xs: 12, sm: 6, md: 6, lg: 4, xl: 4 }}>
          <Controller
            name="firstName"
            control={form.control}
            rules={{ required: true }}
            render={({ field }) => (
              <TextField
                {...field}
                required
                label="First name"
                fullWidth
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 6, lg: 4, xl: 4 }}>
          <Controller
            name="lastName"
            control={form.control}
            rules={{ required: true }}
            render={({ field }) => (
              <TextField
                {...field}
                required
                label="Last name"
                fullWidth
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4, xl: 4 }}>
          <Controller
            name="organisation"
            control={form.control}
            rules={{ required: true }}
            render={({ field }) => (
              <TextField
                {...field}
                required
                label="Organisation"
                fullWidth
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4, xl: 4 }}>
          <Controller
            name="phone"
            control={form.control}
            rules={{ required: true }}
            render={({ field }) => (
              <TextField
                {...field}
                required
                label="Phone"
                fullWidth
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4, xl: 4 }}>
          <Controller
            name="categoryId"
            control={form.control}
            rules={{ required: true }}
            render={({ field }) => (
              <TextField
                {...field}
                required
                label="Stall category"
                select
                fullWidth
                disabled={categoriesLoading}
              >
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>
                ))}
              </TextField>
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
          <Controller
            name="preferredLocation"
            control={form.control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Preferred location"
                multiline
                minRows={2}
                fullWidth
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
          <Controller
            name="items"
            control={form.control}
            rules={{ required: true }}
            render={({ field }) => (
              <TextField
                {...field}
                required
                label="Items to be sold or displayed"
                multiline
                minRows={3}
                fullWidth
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
          <Controller
            name="layoutFeatures"
            control={form.control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Layout or special features"
                multiline
                minRows={3}
                fullWidth
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6, xl: 6 }}>
          <Controller
            name="stallImage"
            control={form.control}
            render={({ field }) => (
              <Button variant="contained" component="label" fullWidth>
                Upload stall setup image
                <input
                  hidden
                  type="file"
                  accept="image/*"
                  onChange={(event) => field.onChange(event.target.files)}
                />
              </Button>
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6, xl: 6 }}>
          <Controller
            name="insuranceProof"
            control={form.control}
            render={({ field }) => (
              <Button variant="contained" component="label" fullWidth>
                Upload public liability insurance
                <input
                  hidden
                  type="file"
                  accept="application/pdf,image/*"
                  onChange={(event) => field.onChange(event.target.files)}
                />
              </Button>
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
          <Controller
            name="notes"
            control={form.control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Additional notes"
                multiline
                minRows={3}
                fullWidth
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 6, lg: 3, xl: 2 }}>
          <Button variant="contained" type="submit" sx={{ mt: 2 }}>Submit</Button>
        </Grid>
      </Grid>
      <AlertDialog title={alertTitle} message={alertMessage} open={alertOpen} setOpen={setAlertOpen} redirect="/stalls" />
    </form>
  )
}
