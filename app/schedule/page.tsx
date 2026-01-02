import { Background } from "../components/Background";
import horseJump2 from "../images/gallery/Horse_Jump_2.jpg"
import { PdfViewer } from "../components/PdfViewer";

export default function Schedule(){
  return (
    <>
      <Background image={horseJump2}/>
      <PdfViewer pdfFilePath={"/81st-Annual-Dalgety-Show-2025-Horse-Schedule.pdf"}/>
    </>
  )
}






