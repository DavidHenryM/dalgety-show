import { useMemberships } from '../lib/queryHooks';
import Loading from '../Loading';
import { simpleDateString } from '../utils';
import { DropDownGrid } from './DropDownGrid';

export function MembershipsTable(props: {title: string}){
  const [memberships, loading] = useMemberships()

  const rows = memberships.map((membership, index) => ({
    ...membership, // Spread existing properties
    id: index+1, // Add new property
    firstName: membership.member.firstName,
    lastName: membership.member.lastName,
    email: membership.member.email,
    memberType: membership.type,
    cost: membership.cost,
    applyDate: simpleDateString(membership.applyDate),
    paidDate: membership.paidDate ? simpleDateString(membership.paidDate) : "UNPAID"
  }));
  console.log(rows)

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'firstName', headerName: 'First Name', width: 100 },
    { field: 'lastName', headerName: 'Last Name', width: 120 },
    { field: 'email', headerName: 'Email Address', width: 250 },
    { field: 'memberType', headerName: 'Member Type', width: 130 },
    { field: 'cost', headerName: 'Cost', width: 70 },
    { field: 'applyDate', headerName: 'Application Date', width: 180 },
    { field: 'paidDate', headerName: 'Paid Date', width: 130 },
  ]

  if (loading){
    return (<></>)
  } else {

    return (
      <DropDownGrid rows={rows} columns={columns} loading={loading} title={props.title}></DropDownGrid>
    )
  }
}

