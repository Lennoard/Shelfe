import './styles/global.css';
import { useState } from "react";
import Routes from "./routes";
import { createTheme, ThemeProvider } from "@mui/material";
import SignIn from './pages/SignIn';
import initFirebase from './firebase';
import { getAuth } from "firebase/auth";

const theme = createTheme({
  palette: {
    primary: {
      main: "#2F9FA1",
      light: "#69D0D2",
      dark: "#007073",
    },
  },
});

initFirebase();
const auth = getAuth();

function App() {

  if (!auth.currentUser) {
    return <SignIn />;
  }

  return (
    <ThemeProvider theme={theme}>
      <Routes />
    </ThemeProvider>
  );
}

export default App;
