import { DataGrid } from '@mui/x-data-grid';
import { Box } from "@mui/material";
import { columns, rows } from "../data/schedule";

export function ScheduleTable(props: {sideBarWidth: number}){
  <Box sx={{ height: 400, width: "fit-content", ml: `${props.sideBarWidth}px`, justifySelf: "center" }}>
    <DataGrid
      rows={rows}
      columns={columns}
      initialState={{
        columns: {
          columnVisibilityModel: {
            id: false
          }
        },
        pagination: {
          paginationModel: {
            pageSize: 5,
          },
        },
      }}
      pageSizeOptions={[5]}
      checkboxSelection
      disableRowSelectionOnClick
    />
  </Box>
}