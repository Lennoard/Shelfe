import { getAuth } from "@firebase/auth";
import { getFirestore } from "@firebase/firestore";
import { useHistory } from "react-router-dom";
import {
  Grid,
  Card,
  ButtonBase,
  Skeleton,
  Typography,
  Box,
  Button,
} from "@mui/material";
import { useState, useEffect } from "react";
import IUserBook from "../../data/models/book/IUserBook";
import UserBookManagerImpl from "../../services/books/UserBookManagerImpl";
import ShelfeDrawer from "../../components/ShelfeDrawer";
import BookCard from "../../components/BookCard";
import noBooksIllustration from "./images/imagery_noBooksFound.png";

const userBookManager = new UserBookManagerImpl(getAuth(), getFirestore());

export default function Dashboard() {
  const [userBooks, setUserBooks] = useState<Array<IUserBook>>([]);
  const [isDataLoaded, setDataLoaded] = useState(false);
  const history = useHistory();

  useEffect(() => {
    getAuth().onAuthStateChanged((user) => {
      if (!user) {
        history.replace("/");
        return;
      }
      userBookManager.getUserBooks().then((books) => {
        setUserBooks(books);
        setDataLoaded(true);
      });
    });
  }, []);

  let bookTotal = userBooks.length + " Livros foram encontrados em sua conta.";

  if (userBooks.length > 0 && isDataLoaded) {
    return (
      <ShelfeDrawer title={bookTotal}>
        <Grid container spacing={4} rowSpacing={3}>
          {userBooks.flatMap((book) => {
            return (
              <Grid item xs={12} sm={6}>
                <BookCard
                  book={book}
                  onClick={() => {
                    history.push(`/book?id=${book.id}`);
                  }}
                />
              </Grid>
            );
          })}
        </Grid>
      </ShelfeDrawer>
    );
  } else if (userBooks.length === 0 && isDataLoaded) {
    return (
      <ShelfeDrawer>
        <Grid item xs={12}>
          <Box
            className="flex-center"
            sx={{
              flexDirection: "column",
              height: "100vh",
              marginTop: "-160px",
            }}
          >
            <img id="imagery" src={noBooksIllustration} alt="Sua estante está vazia." />
            <Typography variant="h6">
              Nenhum livro adicionado a sua conta ainda, que tal adicionar um
              agora mesmo?
            </Typography>
            <Button
              variant="outlined"
              size="large"
              style={{ marginTop: 20 }}
              onClick={() => {
                history.push("/search");
              }}
            >
              Adicionar livros
            </Button>
          </Box>
        </Grid>
      </ShelfeDrawer>
    );
  } else {
    return (
      <ShelfeDrawer title={bookTotal}>
        <Grid container spacing={4} rowSpacing={3}>
          {FakeSearchResultsGrid()}
        </Grid>
      </ShelfeDrawer>
    );
  }
}

function FakeSearchResultsGrid() {
  return [1, 2, 3, 4, 5, 6].map(() => {
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
  });
}
