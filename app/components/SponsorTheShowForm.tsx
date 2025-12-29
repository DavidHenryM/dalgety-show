'use client'

import { Divider, FormControl, FormControlLabel, FormLabel, Grid, InputAdornment, InputLabel, OutlinedInput, Radio, RadioGroup, Slider, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useSponsorshipPackages } from "../lib/queryHooks";
import Loading from "../Loading";
import { SponsorshipPackage, SponsorshipPackageTier } from "../generated/prisma/client";

export function SponsorTheShowForm(props: {email: string | null | undefined}){
  const [pack, setPack] = useState<SponsorshipPackage | undefined>()
  const [tier, setTier] = useState<SponsorshipPackageTier>()
  const [tiers, setTiers] = useState<SponsorshipPackageTier[]>()
  const [packs, loading] = useSponsorshipPackages()

  useEffect(()=>{
    if (!loading){
      let tiersTemp: SponsorshipPackageTier[] = []
      packs.forEach((thispack)=>{
        tiersTemp.push(thispack.tier)
      })
      setTiers(tiersTemp)
      console.log(tiers)
    }
  },[loading])

  const handleTierChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTier((event.target as HTMLInputElement).value as SponsorshipPackageTier)
    setPack(packs.find(singlePack => singlePack.tier == tier))
  };

  return (
    <FormControl>
      <Grid container spacing={5} sx={{margin:2}}>
        <Grid size={12} spacing={2} p={2} sx={{justifyItems: "center"}}>
          <Typography variant="h4">Sponsor The Show</Typography>
        </Grid>
        <Divider/>
        <Grid size={12} spacing={2} p={2} sx={{justifyItems: "center"}}>
          <Typography variant="h5">Primary Contact Information</Typography>
        </Grid>
        <Grid size={3}>
          <TextField
              required
              id="outlined-required"
              label="Contact first name"
            />
        </Grid>
        <Grid size={3}>
          <TextField
              required
              id="outlined-required"
              label="Contact last name"
            />
        </Grid>
        <Grid size={3}>
          <TextField
              id="outlined-read-only-input"
              label="Contact email"
              slotProps={{
                input: {
                  readOnly: true,
                }
              }}
              // value={props.email}
            />
        </Grid>
        <Grid size={12} spacing={2} p={2} sx={{justifyItems: "center"}}>
          <Typography variant="h5">Organisation Information</Typography>
        </Grid>
        <Grid size={3}>
          <TextField
              required
              id="outlined-required"
              label="Organisation name"
            />
        </Grid>
        <Grid size={12} spacing={2} p={2} sx={{justifyItems: "center"}}>
          <Typography variant="h5">Sponsorship</Typography>
        </Grid>
          {loading ? <Loading/> :
            <Grid size={3}>
              <FormLabel id="demo-radio-buttons-group-label">Sponsorship Package</FormLabel>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                value={tier}
                name="radio-buttons-group"
                onChange={handleTierChange}
              >
                {
                  tiers ?
                  tiers.map((thisTier, index)=>{
                    // console.log(thispack)
                    return <FormControlLabel key={`radio-pack${index}`} value={thisTier} control={<Radio />} label={thisTier} />
                  }) : <></>
                }

              </RadioGroup>
            </Grid>
          }
        <Grid size={3}>
          <Slider
            aria-label="$ Amount"
            // defaultValue={pack?.minimumAmount}
            getAriaValueText={valuetext}
            valueLabelDisplay="auto"
            shiftStep={50}
            step={10}
            marks
            />

        </Grid>
      </Grid>
    </FormControl>
  )
}

function valuetext(value: number) {
  return `$${value.toFixed(0)}`
}