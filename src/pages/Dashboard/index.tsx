import { getAuth } from '@firebase/auth';
import { getFirestore } from '@firebase/firestore';
import { Container, Grid, Typography } from '@mui/material';
import { useState, useEffect } from "react";
import IUserBook from '../../data/models/book/IUserBook';

import UserBookManagerImpl from '../../services/books/UserBookManagerImpl';

const userBookManager = new UserBookManagerImpl(getAuth(), getFirestore());

export default function Dashboard() {
  useEffect(() => {
    userBookManager
      .getUserBooks()
      .then((books) => {
        console.log(books);
      }).catch((error) => {
        console.error(error);
      });
  });

  const [userBooks, setUserBooks] = useState<Array<IUserBook>>([]);
  
  return (
    <Container>
      <Grid container rowSpacing={1} columnSpacing={4}>
        <Grid item xs={6}>
          <Typography marginTop="24px" variant="h3">
            Dashboard
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography marginTop="24px" marginBottom="24px" variant="h4">
            Books
          </Typography>
          <ol>
            {userBooks.map((book) => (
              <li>{book.title}</li>
            ))}
          </ol>
        </Grid>
      </Grid>
    </Container>
  );
}
