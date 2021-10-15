import {
  getAuth,
  signInWithEmailAndPassword
} from "firebase/auth";
import {
  Container,
  TextField,
  Typography,
  Snackbar,
  SnackbarCloseReason,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import Grid from "@mui/material/Grid";
import React, { useState } from "react";
import GoogleSignInButton from "../../components/GoogleSignInButton";
import showLocalizedAuthError from "../auth/AuthErrors";
import { useHistory } from "react-router-dom";

import bookLogo from "../../images/pages/signin/book.svg";

import "./signin.css";
import initFirebase from "../../firebase";

initFirebase();
const auth = getAuth();

export interface IAuthCredential {
  email: string;
  password: string;
}

export interface IToast {
  toastOpen: boolean;
  errorMessage: string;
}

export default function SignIn() {
  const history = useHistory();
  const [credentials, setCredentials] = useState<IAuthCredential>({
    email: "",
    password: "",
  });
  const [toast, setToast] = useState<IToast>({
    toastOpen: false,
    errorMessage: "Falha ao fazer login",
  });
  const [loading, setLoading] = useState(false);

  const handleSignInClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading(true);

    const user = await performAuth(
      credentials.email!!,
      credentials.password!!
    );

    if (user) {
      setLoading(false);
      history.push("/dashboard");
    }
  };

  async function performAuth(
    email: string,
    password: string
  ) {
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      return user;
    } catch (error: any) {
      setToast({
        toastOpen: true,
        errorMessage: showLocalizedAuthError(error.message),
      });
      setLoading(false);
      return null;
    }
  }

  const handleToastClose = (
    _: React.SyntheticEvent<any, Event>,
    reason: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") return;
    setToast({ ...toast, toastOpen: false });
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
            onChange={(event) =>
              setCredentials({ ...credentials, email: event.target.value })
            }
            required
          />

          <TextField
            id="password"
            type="password"
            label="Senha"
            margin="dense"
            onChange={(event) =>
              setCredentials({ ...credentials, password: event.target.value })
            }
            required
          />

          <div>
            <LoadingButton
              loading={loading}
              id="sign-in-button"
              variant="outlined"
              onClick={(e) => handleSignInClick(e)}
            >
              Entrar com email
            </LoadingButton>
            <GoogleSignInButton />

            <Snackbar
              open={toast.toastOpen}
              autoHideDuration={3000}
              onClose={handleToastClose}
              message={toast.errorMessage}
            />
          </div>
        </Grid>
      </Grid>
    </Container>
  );
}
