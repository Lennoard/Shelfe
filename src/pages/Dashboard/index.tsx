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
  Modal,
  Checkbox,
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
import {
  parseBookStatusInt,
  parseBookStatusIntToTitle,
} from "../../domain/BookStatus";
import { AiOutlineFilter } from "react-icons/ai";

const userBookManager = new UserBookManagerImpl(getAuth(), getFirestore());

export default function Dashboard() {
  const [userBooks, setUserBooks] = useState<Array<IUserBook>>([]);
  const [isDataLoaded, setDataLoaded] = useState(false);
  const history = useHistory();

  const [sortButton, setSortButton] = useState<null | HTMLElement>(null);
  const sortButtonOpenBool = Boolean(sortButton);
  const [sortFilters, setSortFilters] = useState({
    selectedSortBy: 1,
    selectedOrderBy: 1,
    filters: [
      { id: 0, boolStatus: true },
      { id: 1, boolStatus: true },
      { id: 2, boolStatus: true },
      { id: 3, boolStatus: true },
      { id: 4, boolStatus: true },
    ],
  });
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    getAuth().onAuthStateChanged((user) => {
      if (!user) {
        history.replace("/");
        return;
      }
      userBookManager.getUserBooks().then((books) => {
        setUserBooks(getUserBooksFiltered(books, sortFilters));
        setDataLoaded(true);
      });
    });
  }, [history, sortFilters]);
  const handleModalOpen = () => setOpenModal(true);
  const handleModalClose = () => setOpenModal(false);
  const handleSortButtonClick = (event: React.MouseEvent<HTMLElement>) => {
    setSortButton(event.currentTarget);
  };
  const handleSortButtonClickClose = () => {
    setSortButton(null);
  };

  const HandleSortButtonSelection = (SortcategorySelectedByUser: number) => {
    setSortFilters({
      selectedSortBy: SortcategorySelectedByUser,
      selectedOrderBy: sortFilters.selectedOrderBy,
      filters: [
        { id: 0, boolStatus: sortFilters.filters[0].boolStatus },
        { id: 1, boolStatus: sortFilters.filters[1].boolStatus },
        { id: 2, boolStatus: sortFilters.filters[2].boolStatus },
        { id: 3, boolStatus: sortFilters.filters[3].boolStatus },
        { id: 4, boolStatus: sortFilters.filters[4].boolStatus },
      ],
    });
    handleSortButtonClickClose();
    return null;
  };

  const handleOrderByButton = () => {
    let orderBy = sortFilters.selectedOrderBy;
    let oldFilters = sortFilters.filters;
    setSortFilters({
      selectedSortBy: sortFilters.selectedSortBy,
      selectedOrderBy: orderBy === 1 ? 0 : 1,
      filters: oldFilters,
    });
    return null;
  };

  const handleFilterSelect = (value: number) => {
    let newFilters = sortFilters.filters.map((filter) => {
      if (value === filter.id) {
        return { ...filter, boolStatus: !filter.boolStatus };
      } else {
        return filter;
      }
    });

    setSortFilters({
      selectedSortBy: sortFilters.selectedSortBy,
      selectedOrderBy: sortFilters.selectedOrderBy,
      filters: newFilters,
    });

    return true;
  };

  let toolbarTitle =
    userBooks.length > 0 ? "Coleção" : "Procurando lista de livros…";

  const filterButtons = (
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
        {
          sortFiltersItems.Items.find(
            (item) => sortFilters.selectedSortBy === item.id
          )?.title
        }
        {sortFilters.selectedOrderBy === 1 ? (
          <HiOutlineArrowNarrowDown style={{ marginLeft: 3 }} />
        ) : sortFilters.selectedOrderBy === 0 ? (
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

      <Button
        style={{
          backgroundColor: "#8EF9DD",
          color: "#000000",
          borderRadius: 15,
          marginInlineEnd: 25,
          marginTop: 35,
        }}
        onClick={handleModalOpen}
      >
        Filtrar {<AiOutlineFilter style={{ marginLeft: 5 }} />}
      </Button>

      <Modal
        open={openModal}
        onClose={handleModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            borderRadius: 5,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Selecione seus filtros
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Marque as categorias que deseja que sejam incluídas ou removidas da
            sua lista de livros.
          </Typography>
          <Grid container spacing={1}>
            {sortFilters.filters.map((filter) => {
              return (
                <Grid item xs={6}>
                  <Checkbox
                    checked={filter.boolStatus}
                    onChange={() => handleFilterSelect(filter.id)}
                  />{" "}
                  {parseBookStatusIntToTitle(filter.id)}
                </Grid>
              );
            })}
          </Grid>
        </Box>
      </Modal>

      <Menu
        id="basic-menu"
        anchorEl={sortButton}
        open={sortButtonOpenBool}
        onClose={handleSortButtonClickClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        {sortFiltersItems.Items.map((item) => {
          if (item.id === sortFilters.selectedSortBy) {
            return (
              <MenuItem
                key={item.id}
                selected
                onClick={() => HandleSortButtonSelection(item.id)}
              >
                {item.title}
              </MenuItem>
            );
          } else {
            return (
              <MenuItem
                key={item.id}
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
  if (userBooks.length > 0 && isDataLoaded) {
    return (
      <ShelfeDrawer
        title={toolbarTitle}
        selectedIndex={0}
        filters={filterButtons}
      >
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

const sortFiltersItems = {
  name: "Classificar",
  icon: <MdOutlineSort style={{ marginLeft: 5 }} />,
  Items: [
    {
      id: 1,
      title: "Lendo",
    },
    {
      id: 2,
      title: "Em espera",
    },
    {
      id: 0,
      title: "Desistido",
    },
    {
      id: 4,
      title: "Planejo ler",
    },
    {
      id: 3,
      title: "Finalizado",
    },
  ],
};

/**
 * This function receives the user's book list and applies the filters selected by the user.
 * @param {books} - array containing all user books.
 * @param {sortFilters} - array containing all selected filters by the user.
 * @returns {array} - array containing filtered filters to the render.
 */
const getUserBooksFiltered = (
  books: Array<IUserBook>,
  sortFilters: {
    selectedSortBy: number;
    selectedOrderBy: number;
    filters: Array<{
      id: number;
      boolStatus: boolean;
    }>;
  }
) => {
  var response: Array<IUserBook> = [];

  for (let book of books) {
    let isFilterActive = false;
    let bookStatusInt = parseBookStatusInt(book.status);

    sortFilters.filters.forEach((filter) => {
      if (filter.id === bookStatusInt && filter.boolStatus === true) {
        isFilterActive = true;
      }
    });

    if (!isFilterActive) continue;

    if (book.status === sortFilters.selectedSortBy) {
      if (sortFilters.selectedOrderBy === 0) {
        response.push({ ...book, statusRank: -99 + book.progress });
      } else {
        response.push({ ...book, statusRank: 99 + book.progress });
      }
    } else {
      response.push({ ...book, statusRank: book.status });
    }
  }

  return response.sort(function (a: any, b: any) {
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
