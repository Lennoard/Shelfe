import './styles/global.css';
import Routes from "./routes";
import { createTheme, ThemeProvider } from "@mui/material";
import initFirebase from './firebase';

const theme = createTheme({
  palette: {
    primary: {
      main: "#2F9FA1",
      light: "#69D0D2",
      dark: "#007073",
    },
    secondary: {
      main: "#1A237E",
      light: "#534bae",
      dark: "#000051",
    },
  },
});

initFirebase();

function App() {

  return (
    <ThemeProvider theme={theme}>
      <Routes />
    </ThemeProvider>
  );
}

export default App;
