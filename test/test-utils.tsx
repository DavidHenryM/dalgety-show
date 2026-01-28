import React, { PropsWithChildren } from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { lightTheme } from "@app/theme";
import { render } from "@testing-library/react";

export function Providers({ children }: PropsWithChildren) {
  return (
    <ThemeProvider theme={lightTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}

export function renderWithProviders(ui: React.ReactElement) {
  return render(ui, { wrapper: Providers });
}
