import { Grid, Paper } from "@mui/material";
import horseSchedule2025 from "../../assets/documents/81st Annual Dalgety Show 2025 Horse Schedule.pdf"
import { Document, Page } from 'react-pdf';
import { pdfjs } from 'react-pdf';
import { useState } from "react";
import * as React from 'react';
import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { Background } from "../../components/Background";
import horseJump2 from "../../assets/images/gallery/Horse_Jump_2.jpg"




export default function Schedule(props: {sideBarWidth: number}){
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPageNumber(value);
  };


  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
  ).toString();

    function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }
  



  return (
    <>
    <Background image={horseJump2}/>
    <Grid container spacing={2} padding={2} sx={{ml: `${props.sideBarWidth}px`, mt: "25px", justifyContent: "center"}}>
      <Grid size={5} alignItems={"center"}>
        <Paper sx={{ml: `${props.sideBarWidth}px`, justifyItems: "center"}}>
          <Document file={horseSchedule2025} onLoadSuccess={onDocumentLoadSuccess}>
            <Page pageNumber={pageNumber} />
          </Document>
        </Paper>
      </Grid>
      <Grid>
                <Stack spacing={2}>
        <Typography>Page: {pageNumber}</Typography>
        <Pagination count={numPages} page={pageNumber} onChange={handlePageChange} />
      </Stack>
      </Grid>
</Grid>
    </>
  );
};






