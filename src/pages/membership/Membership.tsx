import { Paper } from "@mui/material";

export default function Membership(props: {windowMargins: {ml: number, mb: number}}){
  return (
    <Paper sx={{ml: `${props.windowMargins.ml}px`}}>
    <section className="container mx-auto px-6 py-12">
      <h2 className="text-3xl font-bold mb-6">Membership</h2>
      <p className="text-lg text-gray-700">
        Become a member of the Dalgety Show Society and support the continuation
        of this iconic rural event.
      </p>
    </section>
    </Paper>
  );
};


