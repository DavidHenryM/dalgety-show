'use client'

import { Button, Divider, FormControl, FormControlLabel, FormLabel, Grid, InputAdornment, InputLabel, OutlinedInput, Radio, RadioGroup, Slider, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useSponsorshipPackages } from "../lib/queryHooks";
import Loading from "../Loading";
import { Membership, MembershipPackage, MembershipType, SponsorshipPackage, SponsorshipPackageTier } from "../generated/prisma/client";
import { createMembership, createOrganisation, createSponsorship, updateUserName } from "../lib/mutations";
import { OrganisationCreateInput, SponsorshipCreateInput } from "../generated/prisma/models";
import { getOrganisation, getShow, getValidMembershipPackages } from "../lib/queries";
import { getNextShowDate } from "../utils";
import Waiting from "./Waiting";
import { useForm, SubmitHandler, Controller } from "react-hook-form"

type Inputs = {
  firstName: string
  lastName: string
  cost: number
  memberType: MembershipType
}

export function MembershipForm(props: {email: string | null | undefined}){
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(false)
  const [pack, setPack] = useState<MembershipPackage>()
  const [packs, setPacks] = useState<MembershipPackage[]>([])


  useEffect(()=>{
    setLoading(true)
    getValidMembershipPackages().then((memberPacks)=>{
      console.log(memberPacks)
      if (memberPacks){
        setPacks(memberPacks)
        setPack(memberPacks[0])
        setValue("memberType", memberPacks[0].type)
        setValue("cost", memberPacks[0].cost)
      }
    }).finally(()=>setLoading(false))
  },[])

  const { handleSubmit, control, reset, setValue } = useForm<Inputs>()

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log(data)
    setSubmitting(true)
    let email = props.email ? props.email : ""
    updateUserName(email, data.firstName, data.lastName).then((user)=>{
      createMembership(data.memberType, data.cost, user.id).then((result)=>{
        console.log(result)
      })
    }).finally(()=>setSubmitting(false))

  }




  const handleMembershipTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newMembershipType = (event.target as HTMLInputElement).value as MembershipType
    const selectedPack = packs.find(thisPack => thisPack.type === newMembershipType) as MembershipPackage
    if(selectedPack){
      setPack(selectedPack)
      setValue("cost", selectedPack.cost)
      setValue("memberType", selectedPack.type)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit, ()=>{console.log("Invalid")})}>
      <Waiting open={submitting} message={"Submitting your sponsorship"}/>
        <Grid container spacing={2} sx={{margin:2, justifySelf:"center"}}>
          <Grid size={12} spacing={2} p={2} sx={{justifyItems: "center"}}>
            <Typography variant="h4" color="primary">Become a Member</Typography>
          </Grid>
          <Divider/>
          <Grid size={12} spacing={2} p={2} sx={{justifyItems: "center"}}>
            <Typography variant="h5" color="primary">Your Information</Typography>
          </Grid>
          {props.email ?
          <Grid size={{xs:12, sm: 12, md: 12, lg: 6, xl: 12}}>
            <TextField
              id="outlined-read-only-input"
              // label="Contact email"
              slotProps={{
                input: {
                  readOnly: true,
                }
              }}
              value={props.email}
              sx={{minWidth: "300px"}}
              disabled={true}
            />
            </Grid>
            : <></>}

          <Grid size={{xs:12, sm: 12, md: 12, lg: 12, xl: 12}}>
            <Controller
              name="firstName"
              control={control}
              rules={{ required: true }}
              render={({ field }) => 
                <TextField              
                  label="Contact first name"
                  {...field}
                  sx={{minWidth: "180"}}
                />
              }
            />
          </Grid>
          <Grid size={{xs:12, sm: 12, md: 12, lg: 12, xl: 12}}>
            <Controller
              name="lastName"
              control={control}
              // rules={{ required: true }}
              render={({ field }) => 
                <TextField
                  {...field}
                  id="outlined-required"
                  label="Contact last name" 
                  sx={{minWidth: "300px"}}
                />
              }
            />
          </Grid>
          <Grid size={12} spacing={2} p={2} sx={{justifyContent: "center"}} container>
          <Grid size={12}>
            <Typography color="primary" sx={{justifySelf: "center"}} variant="h5">Membership</Typography>
          </Grid>
            { loading || !pack ? <Waiting message="Loading..." open={loading || !pack} /> :
              <>
                <Grid size={{xs:12, sm: 12, md: 6, lg: 6, xl: 6}}>
                  <FormLabel id="demo-radio-buttons-group-label">Membership Type</FormLabel>
                  <Controller
                    name="memberType"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => 
                      <RadioGroup
                        aria-label="sponsor-tier-radio-buttons-group"
                        value={field.value}
                        name={field.name}
                        onChange={(e) => {
                          field.onChange(e);
                          handleMembershipTypeChange(e)
                        }
                        }
                      >
                        {
                          packs.map((thisPack, index)=>{
                            return <FormControlLabel key={`radio-pack${index}`} value={thisPack.type} control={<Radio/>} label={thisPack.type} />
                          }) 
                        }
                      </RadioGroup>
                    }/>
                </Grid>
                { !pack ? <Loading/> :
                  <>
                  <Grid size={{xs:12, sm: 6, md: 6, lg: 6, xl: 6}}>
                      <InputLabel>Amount</InputLabel>
                      <Controller
                        name="cost"
                        control={control}
                        render={({ field }) => 
                          <OutlinedInput
                            id="outlined-adornment-amount"
                            startAdornment={<InputAdornment position="start">$</InputAdornment>}
                            label="Dollar Amount"
                            value={field.value}
                            readOnly
                          />
                        }
                      />
                  </Grid>
                  
                </>
              }
              
          </>
        }
          <Grid size={{xs:12, sm: 6, md: 6, lg: 3, xl: 2}}> 
            <Button variant="contained" type="submit" sx={{mt:2}}>Submit</Button>
          </Grid>
        </Grid>
        </Grid>
      </form>
  )
}

function valuetext(value: number) {
  return `$${value.toFixed(0)}`
}