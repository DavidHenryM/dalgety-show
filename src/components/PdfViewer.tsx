import { Paper, Pagination, Stack } from "@mui/material";
import { Document, Page } from 'react-pdf';
import { pdfjs } from 'react-pdf';
import { useState } from "react";

export function PdfViewer(props: {sideBarWidth: number, pdfFilePath: string}){
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
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
    <Paper sx={{ml: `${props.sideBarWidth}px`, justifySelf: "center", width: "fit-content", backgroundColor: "secondary.main"}}>
      <Stack direction={"column"} alignItems="center" p={2} spacing={2}>
        <Paper elevation={8}>
          <Document file={props.pdfFilePath} onLoadSuccess={onDocumentLoadSuccess}>
            <Page pageNumber={pageNumber} />
          </Document>
        </Paper>
        <Paper elevation={8} sx={{p: 1, backgroundColor: "secondary.main"}}>
            <Pagination 
              count={numPages} 
              page={pageNumber} 
              onChange={handlePageChange}
              sx={{
                '& .MuiPaginationItem-root': {
                  color: 'primary.main', // Default text color for all items
                },
                '& .Mui-selected': {
                  color: 'secondary.main', // Text color for the active page
                  backgroundColor: 'primary.main', // Optional: background for active page
                },
              }}/>
          {/* </Stack> */}
        </Paper>
      </Stack>
    </Paper>
  )
}