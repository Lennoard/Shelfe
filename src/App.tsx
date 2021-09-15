import React from 'react';
import Grid from '@material-ui/core/Grid';
import { AppBar, Container, Toolbar, Typography } from '@material-ui/core';

function App() {
  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">
            Shelfe
          </Typography>
        </Toolbar>
      </AppBar>

      <Container fixed>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            
          </Grid>
          <Grid item xs={6}>
            
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}

export default App;
