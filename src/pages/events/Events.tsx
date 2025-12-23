import { Paper } from "@mui/material";
import { events } from "../../data/events";

export default function Events(props: {sideBarWidth: number}) {
  return (
    <Paper sx={{ml: `${props.sideBarWidth}px`}}>
    <section className="container mx-auto px-6 py-12">
      <h2 className="text-4xl font-bold text-center mb-10">
        What's On
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {events.map((event, index) => (
          <div
            key={index}
            className="border rounded-lg p-6 shadow hover:shadow-lg transition"
          >
            <h3 className="text-xl font-semibold">{event.title}</h3>
            <p className="mt-2 text-gray-600">{event.time}</p>
          </div>
        ))}
      </div>
    </section>
    </Paper>
  );
};

