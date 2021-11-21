import { Fragment, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import {
  Container,
  Grid,
  Box,
  Typography,
  TextField,
  Card,
  Button,
  Skeleton,
  ButtonBase,
} from "@mui/material";

import "./search.css";
import BooksApiManager from "../../services/BooksApiManager";
import IUserBook from "../../data/models/book/IUserBook";
import searchIllustration from "./images/imagery_search.png";
import noResults from "./images/no-results.svg";
import BookCard from "../../components/BookCard";
import UserBookMapper from "../../data/mappers/UserBookMapper";
import ShelfeDrawer from "../../components/ShelfeDrawer";
import UserBookManagerImpl from "../../services/books/UserBookManagerImpl";
import { getAuth } from "@firebase/auth";
import { getFirestore } from "@firebase/firestore";

const api = new BooksApiManager();
const userBookManager = new UserBookManagerImpl(getAuth(), getFirestore());
const userBookMapper = new UserBookMapper();

export default function Search() {
  const history = useHistory();
  const [searchResults, setSearchResults] = useState<Array<IUserBook>>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [title, setTitle] = useState("Pesquisar");
  const [showEmptyState, setShowEmptyState] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    getAuth().onAuthStateChanged((user) => {
      if (!user) {
        history.replace("/");
        return;
      }

      const performSearch = (query: string) => {
        setSearching(true);
        api
          .search(query)
          .then(([itemsFound, books]) => {
            userBookManager
              .getUserBooks()
              .then(userBooks => {
                setSearching(false);
                setTotalItems(itemsFound);

                let results = books.map((book) => {
                  let userBook = userBooks.find((b) => b.id === book.id);
                  console.warn(userBook);
                  if (userBook) return userBook;
                  return userBookMapper.map(book);
                });

                setSearchResults(results);
              }).catch(error => {
                setSearching(false);
                setTotalItems(itemsFound);

                console.warn(error);
                setSearchResults(books.map(b => userBookMapper.map(b)));
              });
          })
          .catch((error) => {
            console.warn(error);
            setSearching(false);
            setShowEmptyState(true);
          });
      };

      history.listen((location: any) => {
        if (!location.search) {
          setSearchResults([]);
          setShowEmptyState(false);
          return;
        }

        performSearch(
          decodeURIComponent((location.search as string).replace("?q=", ""))
        );
      });

      const query = new URLSearchParams(window.location.search).get("q");
      if (!query) return;

      performSearch(decodeURIComponent(query));
      setSearchQuery(query);
    });
  }, [history]);

  if (showEmptyState) {
    return (
      <ShelfeDrawer title={title} selectedIndex={1}>
        <Box
          className="flex-center"
          style={{
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
          className="flex-center"
          sx={{
            flexDirection: "column",
            height: "100vh",
            marginTop: "-160px",
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
                    history.push(
                      `/search?q=${encodeURIComponent(searchQuery)}`
                    );
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
              <BookCard book={book} onClick={() => {
                history.push(`/book?id=${book.id}`)
              }} />
            </Grid>
          );
        })}
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "36px",
          }}
        >
          <Button variant="contained" onClick={() => setSearchResults([])}>
            Voltar
          </Button>
        </Grid>
      </Grid>
    );
  };

  return (
    <ShelfeDrawer title={title} selectedIndex={1}>
      <Container fixed>
        {searching ? (
          <FakeSearchResultsGrid />
        ) : searchResults.length > 0 ? (
          <SearchResultsGrid />
        ) : (
          <SearchGrid />
        )}
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
      className="flex-center"
      sx={{
        flexDirection: "column",
        marginTop: "-160px",
      }}
    >
      <img
        id="empty-state-image"
        src={noResults}
        alt="Nenhum resultado encontrado"
      />
      <Typography
        color="rgba(0,0,0,.54)"
        marginTop="24px"
        variant="h4"
        textAlign="center"
      >
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
            <Card sx={{ borderRadius: "12px" }}>
              <ButtonBase sx={{ width: "100%" }}>
                <Skeleton width={128} height={200} sx={{ marginLeft: 1 }} />
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
