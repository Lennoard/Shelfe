import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { Container, TextField, Typography, Snackbar } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import Grid from "@mui/material/Grid";
import React, { useState } from "react";
import PropTypes from "prop-types";
import GoogleSignInButton from "../components/GoogleSignInButton";
import showLocalizedAuthError from "../utils/auth/AuthErrors";

import bookLogo from "../images/pages/signin/book.svg";

import "../styles/pages/signin.css";

const auth = getAuth();

onAuthStateChanged(auth, (user) => {
  if (user) {
    // 
  }
});

export default function SignIn() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [toastOpen, setToastOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("Falha ao fazer login");

  const handleSignInClick = async e => {
    e.preventDefault();
    setLoading(true);
    const user = await performAuth(email, password, (message) => {
      setErrorMessage(showLocalizedAuthError(message));
      setToastOpen(true);
      setLoading(false);
    });

    if (user) {
      setLoading(false);
    }
  }

  const handleToastClose = (_, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setToastOpen(false);
  };

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
            onChange={ e => setEmail(e.target.value) }
            required
          />

          <TextField
            id="password"
            type="password"
            label="Senha"
            margin="dense"
            onChange={ e => setPassword(e.target.value) }
            required
          />

          <div>
            <LoadingButton
              loading={loading}
              id="sign-in-button"
              variant="outlined"
              onClick={handleSignInClick}>
              Entrar com email
            </LoadingButton>
            <GoogleSignInButton />

            <Snackbar
              open={toastOpen}
              autoHideDuration={3000}
              onClose={handleToastClose}
              message={errorMessage}
            />
          </div>
        </Grid>
      </Grid>
    </Container>
  );
}

async function performAuth(email, password, errorHandler) {
  return signInWithEmailAndPassword(auth, email, password)
    .then(credential => credential.user)
    .catch(error => {
      errorHandler(error.message)
    });
}
