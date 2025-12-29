import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Accordion, AccordionDetails, AccordionSummary, Grid, Typography } from '@mui/material';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import Loading from '../Loading';

export function DropDownGrid(props: {rows: any[], columns: GridColDef<any>[], loading: boolean, title: string}){
  const paginationModel = { page: 0, pageSize: 5 }
  return (
   <Grid size={12} spacing={2}>
      <Accordion>
        <AccordionSummary
          expandIcon={<ArrowDownwardIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
        <Typography component="span">{props.title}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {
            props.loading ? <Loading/> :
              <DataGrid
                rows={props.rows}
                columns={props.columns}
                initialState={{ pagination: { paginationModel } }}
                pageSizeOptions={[5, 10]}
                checkboxSelection
                sx={{ border: 0 }}
              />
          }
        </AccordionDetails>
      </Accordion>
    </Grid>
  )
}