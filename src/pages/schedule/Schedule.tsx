import { Background } from "../../components/Background";
import horseJump2 from "../../assets/images/gallery/Horse_Jump_2.jpg"
import horseSchedule2025 from "../../../public/81st-Annual-Dalgety-Show-2025-Horse-Schedule.pdf"
import { PdfViewer } from "../../components/PdfViewer";




export default function Schedule(props: {windowMargins: {ml: number, mb: number}}){
  return (
    <>
      <Background image={horseJump2}/>
      <PdfViewer windowMargins={props.windowMargins} pdfFilePath={horseSchedule2025}/>
    </>
  )
}






