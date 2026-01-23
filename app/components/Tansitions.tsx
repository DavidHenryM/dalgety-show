import { Slide } from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import { forwardRef, JSXElementConstructor } from "react";

export const TransitionUp = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<unknown, string | JSXElementConstructor<unknown>>;
  },
  ref: React.Ref<unknown>,
  ) {
    return <Slide direction="up" ref={ref} {...props} />;
  }
)
