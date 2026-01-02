import { type GridColDef } from '@mui/x-data-grid';

export const columns: GridColDef<(typeof rows)[number]>[] = [
  { 
    field: 'id', 
    headerName: 'ID', 
    width: 90,
  },
  { field: 'startTime', 
    headerName: 'Start Time', 
    width: 90
  },
  {
    field: 'category',
    headerName: 'Category',
    width: 150,
    editable: false,
  },
  {
    field: 'item',
    headerName: 'Event/Item',
    width: 200,
    editable: false,
  }
];

export const rows = [
  { id: 0, startTime: "07:00", category: 'Admin', item: 'Ticket office opens'},
  { id: 1, startTime: "07:30", category: 'Admin', item: "Horse secretary's office opens"},

];