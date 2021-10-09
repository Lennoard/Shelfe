import './styles/global.css';
import Routes from "./routes";
import { createTheme, ThemeProvider } from "@mui/material";

const theme = createTheme({
  palette: {
    primary: {
      main: "#2F9FA1",
      light: "#69D0D2",
      dark: "#007073",
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Routes />
    </ThemeProvider>
  );
}

export default App;
