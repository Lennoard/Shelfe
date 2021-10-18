
import { Fragment, useState } from "react";
import { useHistory } from "react-router-dom";
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
  Slide,
  useScrollTrigger,
} from "@mui/material";

import "./search.css";
import BooksApiManager from "../../services/BooksApiManager";
import IBook from "../../data/models/book/IBook";
import searchIllustration from "./images/imagery_search.png";
import noResults from "./images/no-results.svg";
import BookCard from "../../components/BookCard";
import UserBookMapper from "../../data/mappers/UserBookMapper";

const api = new BooksApiManager();

export default function Search(props: Props) {
  const history = useHistory();
  const [searchResults, setSearchResults] = useState<Array<IBook>>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [title, setTitle] = useState("Pesquisar");
  const [showEmptyState, setShowEmptyState] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const performSearch = () => {
    api
      .search(searchQuery)
      .then(([itemsFound, books]) => {
        setTotalItems(itemsFound);
        setSearchResults(books);
      })
      .catch(() => setShowEmptyState(true))
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

  const SearchGrid = () => {
    setTitle("Pesquisar");
    return (
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
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                onKeyPress={(event) => {
                  if (event.key === "Enter") {
                    performSearch();
                  }
                }}
                fullWidth
                hiddenLabel
                autoFocus
              />
            </Card>
          </div>
        </Box>
      </Grid>
    );
  };

  const SearchResultsGrid = () => {
    setTitle(`${totalItems} resultados para "${searchQuery}"`);

    return (
      <Grid container spacing={4} rowSpacing={3} sx={{ marginTop: "36px" }}>
        {searchResults.flatMap((book) => {
          return (
            <Grid item xs={12} sm={6}>
              <BookCard book={new UserBookMapper().map(book)} onClick={() => {
                history.push(`/book?id=${book.id}`)
              }} />
            </Grid>
          );
        })}
        <Grid item xs={12}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "36px"
          }}>
          <Button variant="contained" onClick={() => setSearchResults([])}>Voltar</Button>
        </Grid>
      </Grid>
    );
  }

  return (
    <Fragment>
      <HideOnScroll {...props}>
        <AppBar position="fixed" color="transparent" elevation={0}>
          <Toolbar>
            <Typography marginTop="32px" variant="h4">
              {title}
            </Typography>
          </Toolbar>
        </AppBar>
      </HideOnScroll>
      <Toolbar />
      <Container fixed>
        {searchResults.length > 0 ? <SearchResultsGrid /> : <SearchGrid />}
      </Container>
    </Fragment>
  );
}
interface EmptyStateProps {
  query: string;
}

interface Props {
  window?: () => Window;
  children: React.ReactElement;
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

function HideOnScroll(props: Props) {
  const { children, window } = props;
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
    disableHysteresis: true,
    threshold: 0,
  });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

