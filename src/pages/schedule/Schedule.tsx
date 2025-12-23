import { Paper } from "@mui/material";

export default function Schedule(props: {sideBarWidth: number}){
  return (
    <Paper sx={{ml: `${props.sideBarWidth}px`}}>
    <section className="container mx-auto px-6 py-12">
      <h2 className="text-3xl font-bold mb-6">Schedules & Downloads</h2>
      <ul className="space-y-3">
        <li>
          <a className="text-blue-600 hover:underline" href="#">
            Main Show Schedule (PDF)
          </a>
        </li>
        <li>
          <a className="text-blue-600 hover:underline" href="#">
            Horse Schedule (PDF)
          </a>
        </li>
      </ul>
    </section>
    </Paper>
  );
};

