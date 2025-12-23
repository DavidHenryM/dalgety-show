import { AppBar, Grid, Paper, Typography } from "@mui/material";

const Footer: React.FC = () => {
  return (
    <AppBar position="fixed" color="primary" sx={{ maxHeight: 100, top:"auto", bottom: 0, }}>
      <Grid
        container
        direction="row"
        sx={{
          justifyContent: "center",
          p: 2
        }}
      >
        <Paper elevation={1} color="secondary" sx={{p: 2}} >
          <Typography color="primary">
            Dalgety Show Society {new Date().getFullYear()}
          </Typography>
        </Paper>
      </Grid>
    </AppBar>
  );
};

export default Footer;
