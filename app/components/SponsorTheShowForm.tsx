'use client'

import { Button, Divider, FormControl, FormControlLabel, FormLabel, Grid, InputAdornment, InputLabel, OutlinedInput, Radio, RadioGroup, Slider, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useSponsorshipPackages } from "../lib/queryHooks";
import Loading from "../Loading";
import { Organisation, SponsorshipPackage, SponsorshipPackageTier } from "../generated/prisma/client";
import { useForm, Controller } from "react-hook-form";
import { createOrganisation, createSponsorship, updateUserName } from "../lib/mutations";
import { OrganisationCreateInput, SponsorshipCreateInput, UserCreateNestedOneWithoutOrganisationInput } from "../generated/prisma/models";
import { getOrganisation, getShow } from "../lib/queries";
import { getNextShowDate } from "../utils";
import Waiting from "./Waiting";

export function SponsorTheShowForm(props: {email: string | null | undefined}){
  const [packs, loading] = useSponsorshipPackages()
  const [pack, setPack] = useState<SponsorshipPackage | undefined>()
  const [selectedTier, setSelectedTier] = useState<SponsorshipPackageTier>("SILVER")
  const [tiers, setTiers] = useState<SponsorshipPackageTier[]>()
  const [dollarAmount, SetDollarAmount] = useState<number>(0)
  const { control, handleSubmit } = useForm();
  const [submitting, setSubmitting] = useState(false)
  
  let maxDollarAmount = 0
  let minDollarAmount = 0

  useEffect(()=>{
    if (!loading){
      let tiersTemp: SponsorshipPackageTier[] = []
      packs.forEach((thispack)=>{
        tiersTemp.push(thispack.tier)
      }) 
      setTiers(tiersTemp)
      if (!pack){
        setPack(packs[2])
      }
      if (tiersTemp){
        setSelectedTier(tiersTemp[0])
      }
      maxDollarAmount = Math.max(...packs.map(item => item.maximumAmount))
      minDollarAmount = Math.min(...packs.map(item => item.minimumAmount))
    }
  },[loading])
  
  const onSubmit = (data: any) => {
    setSubmitting(true)
    let email = props.email ? props.email : ""

    updateUserName(email, data.firstName, data.lastName).then((updatedUser)=>{
      const organisationData: OrganisationCreateInput = {
        name: data.organisation,
        contactPerson: {
          connect: {
            id: updatedUser.id
          }
        }
      }
      getOrganisation(data.organisation, updatedUser.id).then((organisation)=>{
        getShow(getNextShowDate().getFullYear()).then((nextShow)=>{

          if (!organisation){
          const selectedPack = packs.find((singlePack) => {
            return singlePack.tier === selectedTier
          })
            createOrganisation(organisationData).then((createdOrganisation)=>{
              const sponsorshipData: SponsorshipCreateInput = {
                totalAmount: dollarAmount,
                package: {connect: {id: selectedPack.id}},
                show: {connect: {id: nextShow?.id}},
                organisation: {connect: {id: createdOrganisation.id}}
              }
              createSponsorship(sponsorshipData).then((createdSponsorship)=>{
              })
            })
          } else {
            const selectedPack = packs.find((singlePack) => {
              return singlePack.tier === selectedTier
            })
            const sponsorshipData: SponsorshipCreateInput = {
              totalAmount: dollarAmount,
              package: {connect: {id: selectedPack.id}},
              show: {connect: {id: nextShow?.id}},
              organisation: {connect: {id: organisation.id}}
            }
            createSponsorship(sponsorshipData).then((createdSponsorship)=>{

          })
        }
      })
    })
  }).finally(()=>setSubmitting(false))
  }


  const handleTierChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTier = (event.target as HTMLInputElement).value as SponsorshipPackageTier
    setSelectedTier(newTier)
    const selectedPack = packs.find((singlePack) => {
      return singlePack.tier === newTier
    })
    setPack(selectedPack)
    SetDollarAmount(selectedPack.minimumAmount)
  }
  
  const handleSlide = (_event: Event, newValue: number) => {
    SetDollarAmount(newValue);
  }

  const handleTextDollarAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newAmount = event.target.value === '' ? 0 : Number(event.target.value)
    SetDollarAmount(newAmount)
    if (pack){
      if ((newAmount > pack.maximumAmount || newAmount < pack.minimumAmount)){
          const newPack = findNewPack(newAmount)
          if (newPack){
            setPack(newPack)
            setSelectedTier(newPack.tier)
          }
      }
    } else {
      setPack(findNewPack(newAmount))
    }
    SetDollarAmount(newAmount)
  }

  const findNewPack = (dollarAmount: number): any => {
    return packs.find((testPack)=>{
      return testPack.minimumAmount <= dollarAmount && testPack.maximumAmount >= dollarAmount
    })
  }


  return (
  
    <form onSubmit={handleSubmit(onSubmit)}>
      <Waiting open={submitting} message={"Submitting your sponsorship"}/>
      <FormControl disabled={submitting}>
        <Grid container spacing={5} sx={{margin:2}}>
          <Grid size={12} spacing={2} p={2} sx={{justifyItems: "center"}}>
            <Typography variant="h4">Sponsor The Show</Typography>
          </Grid>
          <Divider/>
          <Grid size={12} spacing={2} p={2} sx={{justifyItems: "center"}}>
            <Typography variant="h5">Primary Contact Information</Typography>
          </Grid>
          <Grid size={3}>
            <Controller
              name="firstName"
              control={control}
              render={({ field }) => 
              <TextField {...field} 
                required
                id="outlined-required"
                label="Contact first name" 
              />}
            />
          </Grid>
          <Grid size={3}>
            <Controller
              name="lastName"
              control={control}
              render={({ field }) => 
              <TextField {...field} 
                required
                id="outlined-required"
                label="Contact last name" 
              />}
            />
          </Grid>
          <Grid size={3}>
            <Controller
              name="email"
              control={control}
              render={({ field }) => 
              <TextField {...field} 
                id="outlined-read-only-input"
                label="Contact email"
                slotProps={{
                  input: {
                    readOnly: true,
                  }
                }}
                value={props.email}
              />
            }
            />
              
          </Grid>
          <Grid size={12} spacing={2} p={2} sx={{justifyItems: "center"}}>
            <Typography variant="h5">Organisation Information</Typography>
          </Grid>
          <Grid size={3}>
            <Controller
              name="organisation"
              control={control}
              render={({ field }) => 
              <TextField {...field} 
                required
                id="outlined-required"
                label="Organisation name" 
              />}
            />

          </Grid>
          <Grid size={12} spacing={2} p={2} sx={{justifyItems: "center"}}>
            <Typography variant="h5">Sponsorship</Typography>
          </Grid>
            { loading || !selectedTier ? <Loading/> :
              <>
                <Grid size={3}>
                  <FormLabel id="demo-radio-buttons-group-label">Sponsorship Package</FormLabel>
                  <RadioGroup
                    aria-label="sponsor-tier-radio-buttons-group"
                    value={selectedTier}
                    name="sponsor-tier-radio-buttons-group"
                    onChange={handleTierChange}
                  >
                    {
                      tiers ?
                      tiers.map((thisTier, index)=>{
                        return <FormControlLabel key={`radio-pack${index}`} value={thisTier} control={<Radio />} label={thisTier} />
                      }) : <></>
                    }

                  </RadioGroup>
                </Grid>
                { !pack ? <Loading/> :
                  <>
                  <Grid size={3}>
                    <Slider
                      orientation="vertical"
                      aria-label="$ Amount"
                      // defaultValue={pack?.minimumAmount}
                      getAriaValueText={valuetext}
                      valueLabelDisplay="auto"
                      shiftStep={10}
                      step={selectedTier === "PLATNIUM" ? 1000 : 50}
                      min={pack.minimumAmount}
                      max={pack.maximumAmount}
                      value={typeof dollarAmount === 'number' ? dollarAmount : 0}
                      onChange={handleSlide}
                      marks
                      />
                  </Grid>

                  <Grid size={3}>
                    <FormControl fullWidth sx={{ m: 1 }}>
                      <InputLabel htmlFor="outlined-adornment-amount">Amount</InputLabel>
                      <OutlinedInput
                        id="outlined-adornment-amount"
                        startAdornment={<InputAdornment position="start">$</InputAdornment>}
                        label="Dollar Amount"
                        onChange={handleTextDollarAmountChange}
                        value={dollarAmount}
                      />
                    </FormControl>
                  </Grid>
                </>
              }
          </>
        }
        <Grid size={3}>
          <Button type="submit">Submit</Button>
        </Grid>
        </Grid>
      </FormControl>
    </form>
  )
}

function valuetext(value: number) {
  return `$${value.toFixed(0)}`
}