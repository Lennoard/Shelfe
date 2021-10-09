import { Button, Container, TextField, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import React from "react";
import GoogleSignInButton from "../components/GoogleSignInButton";

import bookLogo from "../images/pages/signin/book.svg";

import "../styles/pages/signin.css";

function SignIn() {
  return (
    <Container fixed>
      <Grid container rowSpacing={1} columnSpacing={4}>
        <Grid id="left" item xs={6}>
          <img id="shelfe-logo" src={bookLogo} alt="Shelfe logo" />
          <Typography marginTop="24px" variant="h3">
            Shelfe
          </Typography>
          <Typography marginTop="16px" variant="body1">
            Gerenciador de progresso de leitura e resenhas de livros
          </Typography>
        </Grid>
        <Grid id="right" item xs={6}>
          <TextField
            id="email"
            type="email"
            label="Email"
            margin="dense"
            required
          />
  
          <TextField
            id="password"
            type="password"
            label="Senha"
            margin="dense"
            required
          />

          <div>
            <Button id="sign-in-button" variant="outlined">Entrar com email</Button>
            <GoogleSignInButton />
          </div>
        </Grid>
      </Grid>
    </Container>
  );
}

export default SignIn;
