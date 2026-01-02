'use client'

import { Paper, Pagination, Stack, IconButton, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import DownloadIcon from '@mui/icons-material/Download';
import { splitFilePath } from "../utils";
import { drawerWidth } from "../settings";
import dynamic from 'next/dynamic';

const PdfDocument = dynamic(
  () => import('react-pdf').then((mod) => mod.Document),
  { ssr: false }
)

const PdfPage = dynamic(
  () => import('react-pdf').then((mod) => mod.Page),
  { ssr: false }
)

export function PdfViewer(props: {pdfFilePath: string}){
  const [numPages, setNumPages] = useState<number>()
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [pdfWorkerReady, setPdfWorkerReady] = useState<boolean>(false)

  useEffect(() => {
    setPdfWorkerReady(false)
    const loadPdfJs = async () => {
      // Dynamically load the library only on the client
      import("pdfjs-dist/build/pdf.mjs").then(async (pdfjs)=>{
        pdfjs.GlobalWorkerOptions.workerSrc = new URL(
          `//unpkg.com/pdfjs-dist@5.4.296/build/pdf.worker.min.mjs`,
          import.meta.url,
        ).toString()
      })
      // Load the worker
      
    }
    loadPdfJs().then(()=>setPdfWorkerReady(true))
  }, [])

 
  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPageNumber(value);
  }



  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  return (
    <Paper 
      sx={{
        ml: {
          sm: drawerWidth.sm,
          md: drawerWidth.md,
          lg: drawerWidth.lg
        }, 
        justifySelf: "center", 
        width: "fit-content", 
        backgroundColor: "secondary.main"
      }}
    >
      <Stack direction={"column"} alignItems="center" p={2} spacing={2}>
        <Paper elevation={8}>
          { pdfWorkerReady ?
          <PdfDocument file={props.pdfFilePath} onLoadSuccess={onDocumentLoadSuccess}>
            <PdfPage pageNumber={pageNumber} />
          </PdfDocument>
          :
          <Typography>Loading...</Typography>}
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
            <IconButton 
              aria-label="download" 
              size="small" 
              component="a" 
              href={props.pdfFilePath} 
              download={splitFilePath(props.pdfFilePath)[1]}>
              <DownloadIcon fontSize="inherit" />
            </IconButton>
        </Paper>
      </Stack>
    </Paper>
  )
}
