
import { InputHTMLAttributes, useState } from "react";
import { useHistory } from "react-router-dom";

import searchIllustration from "./images/imagery_search.png";
import noResults from "./images/no-results.svg";
import {
  Container,
  AppBar,
  Grid,
  Box,
  Toolbar,
  Typography,
  TextField,
  Card,
  Button,
} from "@mui/material";

import "./search.css";

export default function Search() {
  const history = useHistory();
  const [searchQuery, setSearchQuery] = useState("");
  const [showEmptyState, setShowEmptyState] = useState(false);

  const performSearch = () => {
    // TODO: call Books API
  }

  if (showEmptyState) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          height: "100vh"
        }}
      >
        <EmptyState query={searchQuery} />
        <br />
        <Button variant="contained" onClick={() => setShowEmptyState(false)}>Voltar</Button>
      </div>
    );
  }

  return (
    <AppBar position="fixed" color="transparent" elevation={0}>
      <Toolbar>
        <Typography marginTop="24px" variant="h4">
          Pesquisar
        </Typography>
      </Toolbar>
      <Container fixed>
        <Grid container>
          <Grid item xs={12}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <img id="imagery" src={searchIllustration} alt="Pesquisar" />
              <div id="input-card">
                <Card sx={{ borderRadius: "16px" }}>
                  <TextField
                    sx={{ p: 1, margin: "6px 8px" }}
                    type="text"
                    placeholder="Ex: Harry Potter"
                    margin="dense"
                    variant="standard"
                    InputProps={{ disableUnderline: true }}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    onKeyPress={(event) => {
                      if (event.key === "Enter") {
                        performSearch();
                      }
                    }}
                    fullWidth
                    hiddenLabel
                  />
                </Card>
              </div>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </AppBar>
  );
}

interface EmptyStateProps extends InputHTMLAttributes<HTMLInputElement> {
  query: string;
}

function EmptyState(props: EmptyStateProps) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <img id="empty-state-image" src={noResults} alt="Nenhum resultado encontrado" />
      <Typography
        color="rgba(0,0,0,.54)"
        marginTop="24px"
        variant="h4"
        textAlign="center" >
        Nenhum resultado encontrado para <br />"{props.query}"
      </Typography>
    </Box>
  );
}
