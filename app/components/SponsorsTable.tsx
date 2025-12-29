import { useSponsors } from '../lib/queryHooks';
import Loading from '../Loading';
import { DropDownGrid } from './DropDownGrid';

export function SponsorsTable(props: {showYear: number, title: string}){
  const [sponsors, loading] = useSponsors(props.showYear)

  const sponsorsWithId = sponsors.map((sponsor, index) => ({
    ...sponsor, // Spread existing properties
    id: index+1, // Add new property
    orgName: sponsor.organisation.name,
    orgContact: [sponsor.organisation.contactPerson?.firstName, sponsor.organisation.contactPerson?.lastName].join(" "),
    totalAmount: `$${sponsor.totalAmount.toFixed(2)}`
  }));
  console.log(sponsorsWithId)

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'orgName', headerName: 'Organisation', width: 180 },
    { field: 'orgContact', headerName: 'Contact Person', width: 180 },
    { field: 'package', headerName: 'Package', width: 130 },
    { field: 'totalAmount', headerName: 'Amount', width: 130 },
    
  ]

  if (loading){
    return (<Loading></Loading>)
  } else {

    return (
      <DropDownGrid rows={sponsorsWithId} columns={columns} loading={loading} title={props.title}></DropDownGrid>
    )
  }
}