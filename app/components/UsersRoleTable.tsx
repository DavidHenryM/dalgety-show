import { Role } from '../generated/prisma/client';
import { useUsersWithRole } from '../lib/queryHooks';
import { DropDownGrid } from './DropDownGrid';

export function UsersRoleTable(props: {title: string, role: Role}){
  const [users, loading] = useUsersWithRole(props.role)

  const usersWithId = users.map((user, index) => ({
    ...user, // Spread existing properties
    id: index+1 // Add new property
  }));

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'firstName', headerName: 'First name', width: 130 },
    { field: 'lastName', headerName: 'Last name', width: 130 },
    { field: 'email', headerName: 'Email', width: 240 },
    { field: 'officialRole', headerName: 'Official Role', width: 240 },
  ]

  return (
    <DropDownGrid rows={usersWithId} columns={columns} loading={loading} title={props.title}></DropDownGrid>
  )
}