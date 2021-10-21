
import { Fragment, useState, useEffect } from "react";
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
  Skeleton,
  ButtonBase,
} from "@mui/material";

import "./search.css";
import BooksApiManager from "../../services/BooksApiManager";
import IBook from "../../data/models/book/IBook";
import searchIllustration from "./images/imagery_search.png";
import noResults from "./images/no-results.svg";
import BookCard from "../../components/BookCard";
import UserBookMapper from "../../data/mappers/UserBookMapper";
import { getAuth } from "@firebase/auth";
import ShelfeDrawer from "../../components/ShelfeDrawer";

const api = new BooksApiManager();

export default function Search() {
  const history = useHistory();
  const [searchResults, setSearchResults] = useState<Array<IBook>>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [title, setTitle] = useState("Pesquisar");
  const [showEmptyState, setShowEmptyState] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    getAuth().onAuthStateChanged(user => {
      if (!user) {
        history.replace("/");
        return
      }

      const performSearch = (query: string) => {
        setSearching(true);
        api
          .search(query)
          .then(([itemsFound, books]) => {
            setSearching(false);
            setTotalItems(itemsFound);
            setSearchResults(books);
          })
          .catch(() => {
            setSearching(false);
            setShowEmptyState(true)
          });
      };

      history.listen((location: any) => {
        if (!location.search) {
          setSearchResults([]);
          setShowEmptyState(false);
          return;
        }

        performSearch(
          decodeURIComponent((location.search as string).replace("?q", ""))
        );
      });

      const query = new URLSearchParams(window.location.search).get("q");
      if (!query) return
        
      performSearch(decodeURIComponent(query));
      setSearchQuery(query);

    });
  }, [history])

  if (showEmptyState) {
    return (
      <ShelfeDrawer title={title} selectedIndex={1}>
        <Box
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            height: "100vh",
          }}
        >
          <EmptyState query={searchQuery} />
          <br />
          <Button variant="contained" onClick={() => setShowEmptyState(false)}>
            Voltar
          </Button>
        </Box>
      </ShelfeDrawer>
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
                    history.push(`/search?q=${encodeURIComponent(searchQuery)}`);
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
      <Grid container spacing={4} rowSpacing={3}>
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
    <ShelfeDrawer title={title} selectedIndex={1}>
      <Container fixed>
        {searching
          ? <FakeSearchResultsGrid />
          : searchResults.length > 0
            ? <SearchResultsGrid />
            : <SearchGrid />
        }
      </Container>
    </ShelfeDrawer>
  );
}

interface EmptyStateProps {
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

function FakeSearchResultsGrid() {
  return (
    <Grid container spacing={4} rowSpacing={3}>
      {[1, 2, 3, 4, 5, 6].map(() => {
        return (
          <Grid item xs={12} sm={6}>
            <Card>
              <ButtonBase sx={{ width: "100%" }}>
                <Skeleton width={128} height={240} />
                <div className="bookCardContainer">
                  <Typography
                    className="title"
                    marginTop="24px"
                    variant="h6"
                    noWrap
                  >
                    <Skeleton width={280} />
                  </Typography>

                  <Typography variant="body2">
                    <Skeleton width={160} />
                  </Typography>

                  <Typography variant="body2" marginTop="42px">
                    <Skeleton width={120} />
                  </Typography>

                  <Skeleton width={120} />
                </div>
              </ButtonBase>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
}
