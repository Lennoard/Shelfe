import { getAuth } from "@firebase/auth";
import { getFirestore } from "@firebase/firestore";
import { useHistory } from "react-router-dom";
import { Grid } from "@mui/material";
import { useState, useEffect } from "react";
import IUserBook from "../../data/models/book/IUserBook";
import UserBookManagerImpl from "../../services/books/UserBookManagerImpl";
import ShelfeDrawer from "../../components/ShelfeDrawer";
import UserBookMapper from "../../data/mappers/UserBookMapper";
import BookCard from "../../components/BookCard";

const userBookManager = new UserBookManagerImpl(getAuth(), getFirestore());

export default function Dashboard() {
  const [userBooks, setUserBooks] = useState<Array<IUserBook>>([]);
  const history = useHistory();

  useEffect(() => {
    userBookManager
      .getUserBooks()
      .then((books) => {
        setUserBooks(books);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  let BookTotal =
    userBooks.length > 0
      ? userBooks.length + " Livros foram encontrados em sua conta."
      : null;

  return (
    <ShelfeDrawer title={BookTotal} selectedIndex={0}>
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
}
