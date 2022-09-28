import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  createUserWithEmailAndPassword,
  GoogleAuthProvider
} from "firebase/auth";
import {
  Container,
  TextField,
  Typography,
  Snackbar,
  SnackbarCloseReason,
  Box,
  Tabs,
  Tab,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import Grid from "@mui/material/Grid";
import React, { useEffect, useRef, useState } from "react";
import GoogleSignInButton from "../../components/GoogleSignInButton";
import showLocalizedAuthError from "../../utils/auth/AuthErrors";
import { useHistory } from "react-router-dom";

import bookLogo from "../../images/pages/signin/book.svg";

import "./signin.css";
import initFirebase from "../../firebase";

initFirebase();
const auth = getAuth();
auth.useDeviceLanguage();

export interface IAuthCredential {
  email: string;
  password: string;
}

export interface IToast {
  toastOpen: boolean;
  errorMessage: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
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
  const [activeTab, setActiveTab] = useState(0);
  const [editingInPass, setEditingInPass] = useState(false);
  const emailReference = useRef<HTMLInputElement>(null);
  const passReference = useRef<HTMLInputElement>(null);

  const handleSignInClick = async (
    e: React.MouseEvent<HTMLButtonElement> | null
  ) => {
    e?.preventDefault();
    setLoading(true);

    const user = await performAuth(credentials.email!!, credentials.password!!);

    if (user) {
      setLoading(false);
      history.push("/dashboard");
    }
  };

  const handleSignUpClick = async (
    e: React.MouseEvent<HTMLButtonElement> | null
  ) => {
    e?.preventDefault();
    setLoading(true);

    const user = await performSignUp(credentials.email!!, credentials.password!!);

    if (user) {
      setLoading(false);
      setToast({
        toastOpen: true,
        errorMessage: "Conta criada com sucesso",
      });
      setTimeout(() => {
        history.push("/dashboard");
      }, 2000);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    setCredentials({ ...credentials, email: "", password: "" });
  };

  async function performAuth(email: string, password: string) {
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

  async function performSignUp(email: string, password: string) {
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
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

  async function performGoogleSignIn() {
    const provider = new GoogleAuthProvider();
    try {
      const { user } = await signInWithPopup(auth, provider);
       if (user) {
         setLoading(false);
         history.push("/dashboard");
       }
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
    _: Event | React.SyntheticEvent<any, Event>,
    reason: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") return;
    setToast({ ...toast, toastOpen: false });
  };

  function SignInComponent(): JSX.Element {
    useEffect(() => {
      const currentEmailRef = emailReference.current;
      const currentPassRef = passReference.current;

      if (!editingInPass) {
        currentEmailRef?.focus();
      } else {
        currentPassRef?.focus();
      }
    }, []);

    return (
      <Box display="flex" flexDirection="column">
        <TextField
          key="email"
          type="email"
          label="Email"
          margin="dense"
          inputRef={emailReference}
          value={credentials.email}
          onChange={(event) => {
            setEditingInPass(false);
            setCredentials({ ...credentials, email: event.target.value });
          }}
          onKeyPress={(event) => {
            if (event.key === "Enter") {
              handleSignInClick(null);
            }
          }}
          required
        />

        <TextField
          inputRef={passReference}
          key="password"
          type="password"
          label="Senha"
          margin="dense"
          value={credentials.password}
          onChange={(event) => {
            setEditingInPass(true);
            setCredentials({ ...credentials, password: event.target.value });
          }}
          onKeyPress={(event) => {
            if (event.key === "Enter") {
              handleSignInClick(null);
            }
          }}
          required
        />

        <Box
          sx={{
            display: "flex",
            flexDirection: {
              xs: "column",
              sm: "column",
              md: "row",
              lg: "row",
            },
          }}
        >
          <LoadingButton
            loading={loading}
            variant="outlined"
            sx={{ marginTop: "32px" }}
            onClick={(e) => handleSignInClick(e)}
          >
            Entrar com email
          </LoadingButton>
          <GoogleSignInButton
            text="Entrar com Google"
            onClick={(e) => performGoogleSignIn()}
          />

          <Snackbar
            open={toast.toastOpen}
            autoHideDuration={3000}
            onClose={handleToastClose}
            message={toast.errorMessage}
          />
        </Box>
      </Box>
    );
  }

  function SignUpComponent(): JSX.Element {
    useEffect(() => {
      const currentEmailRef = emailReference.current;
      const currentPassRef = passReference.current;

      if (!editingInPass) {
        currentEmailRef?.focus();
      } else {
        currentPassRef?.focus();
      }
    }, []);

    return (
      <Box display="flex" flexDirection="column">
        <TextField
          key="email"
          type="email"
          label="Email"
          margin="dense"
          inputRef={emailReference}
          value={credentials.email}
          onChange={(event) => {
            setEditingInPass(false);
            setCredentials({ ...credentials, email: event.target.value });
          }}
          onKeyPress={(event) => {
            if (event.key === "Enter") {
              handleSignUpClick(null);
            }
          }}
          required
        />

        <TextField
          inputRef={passReference}
          key="password"
          type="password"
          label="Senha"
          margin="dense"
          value={credentials.password}
          onChange={(event) => {
            setEditingInPass(true);
            setCredentials({ ...credentials, password: event.target.value });
          }}
          onKeyPress={(event) => {
            if (event.key === "Enter") {
              handleSignUpClick(null);
            }
          }}
          required
        />

        <Box
          sx={{
            display: "flex",
            flexDirection: {
              xs: "column",
              sm: "column",
              md: "row",
              lg: "row",
            },
          }}
        >
          <LoadingButton
            loading={loading}
            variant="outlined"
            sx={{ marginTop: "32px" }}
            onClick={(e) => handleSignUpClick(e)}
          >
            Cadastrar com email
          </LoadingButton>

          <GoogleSignInButton text="Cadastrar com Google" onClick={(e) => performGoogleSignIn()} />

          <Snackbar
            open={toast.toastOpen}
            autoHideDuration={3000}
            onClose={handleToastClose}
            message={toast.errorMessage}
          />
        </Box>
      </Box>
    );
  }

  return (
    <Container fixed>
      <Grid container rowSpacing={1} columnSpacing={4}>
        <Grid id="left" item xs={6}>
          <img id="shelfe-logo" src={bookLogo} alt="Shelfe logo" />
          <Typography marginTop="24px" variant="h3">
            Shelfe
          </Typography>
          <Typography marginTop="16px" variant="body1" textAlign="center">
            Gerenciador de progresso de leitura e resenhas de livros
          </Typography>
        </Grid>
        <Grid id="right" item xs={6}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              aria-label="basic tabs example"
            >
              <Tab label="Entrar" {...a11yProps(0)} />
              <Tab label="Cadastrar" {...a11yProps(1)} />
            </Tabs>
          </Box>
          
          <TabPanel value={activeTab} index={0}>
            <SignInComponent />
          </TabPanel>
          <TabPanel value={activeTab} index={1}>
            <SignUpComponent />
          </TabPanel>
        </Grid>
      </Grid>
    </Container>
  );
}

function a11yProps(index: number) {
  return {
    id: `tab-${index}`,
    "aria-controls": `tabpanel-${index}`,
  };
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}
