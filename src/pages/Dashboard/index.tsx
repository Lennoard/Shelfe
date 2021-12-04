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
  Menu,
  MenuItem,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import IUserBook from "../../data/models/book/IUserBook";
import UserBookManagerImpl from "../../services/books/UserBookManagerImpl";
import ShelfeDrawer from "../../components/ShelfeDrawer";
import BookCard from "../../components/BookCard";
import noBooksIllustration from "./images/imagery_noBooksFound.png";
import Grow from "@mui/material/Grow";
import { MdOutlineSort } from "react-icons/md";
import {
  HiOutlineArrowNarrowDown,
  HiOutlineArrowNarrowUp,
} from "react-icons/hi";

const userBookManager = new UserBookManagerImpl(getAuth(), getFirestore());

export default function Dashboard() {
  const [userBooks, setUserBooks] = useState<Array<IUserBook>>([]);
  const [isDataLoaded, setDataLoaded] = useState(false);
  const history = useHistory();
  const sortBy = history.location.pathname.split("/")[2];
  const orderBy = history.location.pathname.split("/")[3];
  if (!sortBy) {
    history.push("/dashboard/reading");
  }

  useEffect(() => {
    getAuth().onAuthStateChanged((user) => {
      if (!user) {
        history.replace("/");
        return;
      }
      userBookManager.getUserBooks().then((books) => {
        setUserBooks(getUserBooksFiltered(books, sortBy, orderBy));
        setDataLoaded(true);
      });
    });
  }, [sortBy, orderBy, history]);

  let toolbarTitle =
    userBooks.length > 0
      ? "Coleção"
      : "Procurando lista de livros…";

  const filterButtons = GetFilterButtons();

  if (userBooks.length > 0 && isDataLoaded) {
    return (
      <ShelfeDrawer title={toolbarTitle} selectedIndex={0} filters={filterButtons}>
        <Grid container spacing={4} rowSpacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6">
              {userBooks.length > 0
                ? userBooks.length + " Livros foram encontrados em sua conta."
                : ""}
            </Typography>
          </Grid>

          {userBooks.flatMap((book, i) => {
            return (
              <Grow in={isDataLoaded}>
                <Grid item xs={12} sm={6}>
                  <BookCard
                    key={i}
                    book={book}
                    onClick={() => {
                      history.push(`/book?id=${book.id}`);
                    }}
                  />
                </Grid>
              </Grow>
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
            <img
              id="imagery"
              src={noBooksIllustration}
              alt="Sua estante está vazia."
            />
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
      <ShelfeDrawer title={toolbarTitle}>
        <Grid container spacing={4} rowSpacing={3}>
          {booksLoadingSkeleton()}
        </Grid>
      </ShelfeDrawer>
    );
  }
}

const GetFilterButtons = () => {
  const buttonFilter = {
    name: "Classificar",
    icon: <MdOutlineSort style={{ marginLeft: 5 }} />,
    Items: [
      {
        id: 1,
        identifier: "reading",
        title: "Lendo",
      },
      {
        id: 2,
        identifier: "waiting",
        title: "Em espera",
      },
      {
        id: 0,
        identifier: "givenup",
        title: "Desistido",
      },
      {
        id: 4,
        identifier: "planned",
        title: "Planejo ler",
      },
      {
        id: 3,
        identifier: "finished",
        title: "Finalizado",
      },
    ],
  };
  const history = useHistory();
  const sortBy = history.location.pathname.split("/")[2];
  const orderBy = history.location.pathname.split("/")[3] ?? "desc";

  const [sortButton, setSortButton] = useState<null | HTMLElement>(null);
  const sortButtonOpenBool = Boolean(sortButton);

  const handleSortButtonClick = (event: React.MouseEvent<HTMLElement>) => {
    setSortButton(event.currentTarget);
  };
  const handleSortButtonClickClose = () => {
    setSortButton(null);
  };

  const HandleSortButtonSelection = (select: Number) => {
    buttonFilter.Items.map((item) => {
      if (select === item.id) {
        handleSortButtonClickClose();
        return history.push("/dashboard/" + item.identifier);
      }
    });
    return null;
  };

  const handleOrderByButton = () => {
    if (!orderBy) {
      return history.push("/dashboard/" + sortBy + "/asc");
    } else if (orderBy === "asc") {
      return history.push("/dashboard/" + sortBy + "/desc");
    } else if (orderBy === "desc") {
      return history.push("/dashboard/" + sortBy + "/asc");
    }

    return null;
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Button
        style={{
          backgroundColor: "#8EF9DD",
          color: "#000000",
          borderRadius: 15,
          marginInlineEnd: 25,
          marginLeft: 180,
          marginTop: 35,
        }}
        onClick={handleOrderByButton}
      >
        {buttonFilter.Items.map((item) => {
          if (sortBy === item.identifier) {
            return item.title;
          }
        })}
        {orderBy === "desc" ? (
          <HiOutlineArrowNarrowDown style={{ marginLeft: 3 }} />
        ) : orderBy === "asc" ? (
          <HiOutlineArrowNarrowUp />
        ) : null}
      </Button>

      <Button
        style={{
          backgroundColor: "#8EF9DD",
          color: "#000000",
          borderRadius: 15,
          marginInlineEnd: 25,
          marginTop: 35,
        }}
        aria-controls="basic-menu"
        aria-haspopup="true"
        aria-expanded={sortButtonOpenBool ? "true" : undefined}
        onClick={handleSortButtonClick}
      >
        Classificar {<MdOutlineSort style={{ marginLeft: 5 }} />}
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={sortButton}
        open={sortButtonOpenBool}
        onClose={handleSortButtonClickClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        {buttonFilter.Items.map((item, i) => {
          if (item.identifier === sortBy) {
            return (
              <MenuItem
                key={i}
                selected
                onClick={() => HandleSortButtonSelection(item.id)}
              >
                {item.title}
              </MenuItem>
            );
          } else {
            return (
              <MenuItem
                key={i}
                onClick={() => HandleSortButtonSelection(item.id)}
              >
                {item.title}
              </MenuItem>
            );
          }
        })}
      </Menu>
    </Box>
  );
};

const getUserBooksFiltered = (
  books: Array<IUserBook>,
  sortBy: string,
  orderBy: string
) => {
  const filters = [
    {
      id: 0,
      identifier: "givenup",
    },
    {
      id: 1,
      identifier: "reading",
    },
    {
      id: 2,
      identifier: "waiting",
    },
    {
      id: 3,
      identifier: "finished",
    },
    {
      id: 4,
      identifier: "planned",
    },
  ];
  var finalArrayReturn: Array<IUserBook> = [];

  books.map((book) => {
    if (filters[book.status].identifier === sortBy) {
      if (orderBy === "asc") {
        finalArrayReturn.push({ ...book, statusRank: -99 + book.progress });
      } else {
        finalArrayReturn.push({ ...book, statusRank: 99 + book.progress });
      }
    } else {
      finalArrayReturn.push({ ...book, statusRank: book.status });
    }
  });

  return finalArrayReturn.sort(function (a: any, b: any) {
    return b.statusRank - a.statusRank;
  });
};

const booksLoadingSkeleton = () => {
  return [1, 2, 3, 4, 5, 6].map((num, i) => {
    return (
      <Grid item xs={12} sm={6} key={i}>
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
};
