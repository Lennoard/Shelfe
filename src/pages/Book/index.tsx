import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import {
  Container,
  Grid,
  Box,
  Typography,
  Card,
  Button,
  Skeleton,
  Chip,
  Divider,
  Paper,
  LinearProgress,
  IconButton,
  Tooltip,
  Modal,
  Input,
  Rating,
  TextField,
} from "@mui/material";

import BooksApiManager from "../../services/BooksApiManager";
import noResults from "./images/no-results.svg";
import IUserBook from "../../data/models/book/IUserBook";
import INote from "../../data/models/INote";
import parseBookStatus, { BookStatus } from "../../domain/BookStatus";
import UserBookManagerImpl from "../../services/books/UserBookManagerImpl";
import { getFirestore, UpdateData } from "@firebase/firestore";
import { getAuth } from "@firebase/auth";
import BrandButton from "../../components/BrandButton";
import {
  Add,
  AddCircleOutline,
  DeleteOutlineOutlined,
  FavoriteBorderOutlined,
  KeyboardArrowDown,
  ModeEditOutlined,
  RemoveCircleOutline,
  Share,
} from "@mui/icons-material";
import BrandButtonSelect from "../../components/BrandButtonSelect";
import UserBookMapper from "../../data/mappers/UserBookMapper";
import ShelfeDrawer from "../../components/ShelfeDrawer";
import { width } from "@mui/system";

const api = new BooksApiManager();
const userBookManager = new UserBookManagerImpl(getAuth(), getFirestore());

export default function Book() {
  const history = useHistory();
  const [showEmptyState, setShowEmptyState] = useState(false);
  const [book, setBook] = useState<IUserBook | null>(null);
  const [openDeleteModal, setDeleteModalOpen] = useState(false);
  const [openAddNoteModal, setAddNoteModalOpen] = useState(false);
  const [showEditProgress, setShowEditProgress] = useState(false);
  const [manualProgress, setManualProgress] = useState(0);
  const handleCloseModal = () => setDeleteModalOpen(false);
  const handleCloseAddNoteModal = () => setAddNoteModalOpen(false);

  useEffect(() => {
    getAuth().onAuthStateChanged((user) => {
      if (user) {
        const bookId = new URLSearchParams(window.location.search).get("id");
        if (!bookId) {
          setShowEmptyState(true);
          return;
        }

        const queryApi = () => {
          api
            .getBook(bookId)
            .then((book) => {
              if (book) {
                setBook(new UserBookMapper().map(book));
              } else {
                setShowEmptyState(true);
              }
            })
            .catch((error) => {
              console.log(error);
              setShowEmptyState(true);
            });
        };

        userBookManager
          .getUserBook(bookId)
          .then((book) => {
            if (book) {
              setBook(book);
            } else {
              queryApi();
            }
          })
          .catch((error) => {
            console.log(error);
            queryApi();
          });
      } else {
        history.replace("/");
      }
    });
  }, [history]);

  if (showEmptyState) {
    return (
      <ShelfeDrawer selectedIndex={1}>
        <div
          className="flex-center"
          style={{
            flexDirection: "column",
            height: "100vh",
          }}
        >
          <EmptyState />
          <br />
          <Button variant="contained" onClick={() => history.back()}>
            Voltar
          </Button>
        </div>
      </ShelfeDrawer>
    );
  }

  const RightGrid = () => {
    const modalStyle = {
      position: "absolute" as "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: 400,
      bgcolor: "background.paper",
      borderRadius: "16px",
      boxShadow: 24,
      p: 4,
    };

    const imageUrl =
      book == null || book.imageUrls.length === 0
        ? "https://via.placeholder.com/128x192?text=SEM+IMAGEM"
        : book!!.imageUrls[0];

    const bookNotes = book?.notes ?? [];
    return (
      <Grid
        item
        sm={12}
        md={book?.status === BookStatus.NotAdded ? 5 : 6}
        sx={{ transition: "300ms" }}
      >
        <Box className="flex-center" sx={{ marginTop: "-74px" }}>
          {book ? (
            <Card
              style={{
                borderRadius: "16px",
                width: "128px",
                height: "192px",
                margin: "16px",
              }}
            >
              <img src={imageUrl} alt="Capa" height="100%" width="100%" />
            </Card>
          ) : (
            <Skeleton width={128} height={280} />
          )}
        </Box>
        <Box marginTop="30px">
          {book ? (
            book.status === BookStatus.NotAdded ? (
              <BrandButton
                text="Adicionar à lista"
                endIcon={<Add />}
                onClick={() => {
                  book.status = BookStatus.PlanToRead;
                  userBookManager.setUserBook(book).then(() => {
                    setBook({ ...book });
                  });
                }}
              ></BrandButton>
            ) : (
              <UserBookControls />
            )
          ) : (
            <Skeleton width={160} sx={{ textAlign: "center" }} />
          )}

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              marginTop: "32px",
            }}
          >
            <Typography variant="body1" fontWeight="600" sx={{ flexGrow: 1 }}>
              Anotações
            </Typography>

            <BrandButton
              text="Adicionar"
              endIcon={<Add />}
              onClick={() => setAddNoteModalOpen(true)}
            />
          </Box>

          <Modal
            open={openAddNoteModal}
            onClose={handleCloseAddNoteModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={modalStyle}>
              <Typography id="modal-modal-title" variant="h4" component="h2">
                Adicionar nota
              </Typography>

              <TextField
                id="addNoteNotes"
                key="addNoteNotes"
                type="text"
                label="Anotações"
                sx={{ marginTop: "24px", width: "100%" }}
                required
                autoFocus
              />

              <TextField
                id="addNoteChapter"
                key="addNoteChapter"
                type="number"
                label="Capítulo"
                sx={{ marginTop: "16px", width: "100%" }}
                required
              />

              <br />
              <Button
                variant="text"
                color="primary"
                onClick={() => {
                  let notes = (document.getElementById("addNoteNotes") as HTMLInputElement).value
                  let chapter = parseInt((document.getElementById("addNoteChapter") as HTMLInputElement).value)
                  let note = {
                    notes: notes,
                    chapter: chapter,
                    createdAt: new Date(),
                  } as INote;

                  setAddNoteModalOpen(false);
                  bookNotes.push(note)
                  book!!.notes = bookNotes;

                  updateBook({ notes: book!!.notes });
                }}
                sx={{ mt: 2, fontWeight: "700" }}
              >
                Adicionar
              </Button>
              <Button
                variant="text"
                onClick={() => {
                  setAddNoteModalOpen(false);
                }}
                sx={{ mt: 2, fontWeight: "700", color: "black" }}
              >
                Cancelar
              </Button>
            </Box>
          </Modal>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            {bookNotes.length > 0 ? (
              bookNotes.map((note) => {
                return (
                  <Box>
                    <Divider sx={{ marginTop: "16px", marginBottom: "16px" }} />
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="body2" color="#212121">
                          {note.notes}
                        </Typography>
                        <Typography variant="body2" color="rgba(0,0,0,.54)">
                          Capítulo {note.chapter}
                        </Typography>
                      </Box>

                      <Divider orientation="horizontal" />

                      <Tooltip title="Deletar nota">
                        <IconButton
                          color="error"
                          onClick={() => {
                            if (book == null) return;

                            book.progress++;
                            let index = bookNotes.indexOf(note);
                            bookNotes.splice(index, 1);
                            book.notes = bookNotes;

                            updateBook({ notes: book.notes });
                          }}
                          sx={{
                            backgroundColor: "#FFEBEE",
                            marginLeft: "16px",
                          }}
                        >
                          <DeleteOutlineOutlined />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                );
              })
            ) : (
              <Typography
                variant="body2"
                color="rgba(0,0,0,.54)"
                sx={{ flexGrow: 1 }}
              >
                Nenhuma anotação adicionada
              </Typography>
            )}
          </Box>
        </Box>
      </Grid>
    );
  };

  const UserBookControls = () => {
    const MIN = 0;
    const maxProgress = book ? book.pageCount : 0;
    const progress = book ? book.progress : 0;
    const normaliseProgress = () =>
      ((progress - MIN) * 100) / (maxProgress - MIN);

    if (book == null) return <div></div>;

    const favBgColor = book.favorite ? "#FFF8E1" : "#E0E0E0";
    const favTextColor = book.favorite ? "#FFC400" : "#616161";

    const modalStyle = {
      position: "absolute" as "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: 400,
      bgcolor: "background.paper",
      borderRadius: "16px",
      boxShadow: 24,
      p: 4,
    };

    return (
      <Paper
        elevation={0}
        variant="outlined"
        sx={{
          width: "100%",
          borderRadius: "16px",
          backgroundColor: "transparent",
        }}
      >
        <Typography
          variant="body1"
          fontWeight="600"
          marginTop="24px"
          marginLeft="16px"
        >
          Progresso
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            marginTop: "-12px",
            padding: "0 8px 0 16px",
          }}
        >
          <LinearProgress
            variant="determinate"
            color="secondary"
            value={normaliseProgress()}
            sx={{
              borderRadius: "16px",
              height: "8px",
              flexGrow: 1,
              marginRight: "8px",
            }}
          />
          <Tooltip title="+1 página">
            <IconButton
              aria-label="add"
              onClick={() => {
                book.progress++;
                updateBook({ progress: book.progress });
              }}
            >
              <AddCircleOutline sx={{ color: "#000" }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="-1 página">
            <IconButton
              aria-label="remove"
              onClick={() => {
                book.progress--;
                updateBook({ progress: book.progress });
              }}
            >
              <RemoveCircleOutline sx={{ color: "#000" }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Editar progresso">
            <IconButton
              aria-label="edit"
              onClick={() => setShowEditProgress(true)}
            >
              <ModeEditOutlined sx={{ color: "#000" }} />
            </IconButton>
          </Tooltip>
        </Box>

        <Typography
          variant="body2"
          color="rgba(0,0,0,.54)"
          marginTop="-12px"
          marginLeft="16px"
        >
          {progress}/{maxProgress}
        </Typography>

        <Input
          type="number"
          defaultValue={manualProgress}
          margin="dense"
          inputProps={{
            max: book.pageCount,
            min: 0,
          }}
          sx={{
            margin: "16px",
            transition: "300ms",
            display: showEditProgress ? "block" : "none",
          }}
          onKeyPress={(event) => {
            if (event.key === "Enter") {
              if (!isNaN(manualProgress) && manualProgress <= book.pageCount) {
                book.progress = manualProgress;
                updateBook({ progress: book.progress });
              }
            }
          }}
          onChange={(event) => {
            let newProgress = parseInt(event.target.value);
            if (!isNaN(newProgress) && newProgress <= book.pageCount) {
              setManualProgress(newProgress);
            }
          }}
          autoFocus
        />

        <Divider sx={{ marginTop: "16px", marginBottom: "16px" }} />

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            padding: "8px 16px",
          }}
        >
          <Box flexGrow={1}>
            <Typography variant="body1" fontWeight="600">
              Último status
            </Typography>
            <Typography variant="body2" color="rgba(0,0,0,.54)">
              {book.lastStatus.toLocaleDateString([], {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </Typography>
          </Box>

          <BrandButtonSelect
            text={parseBookStatus(book.status)}
            endIcon={<KeyboardArrowDown />}
            items={["Desistido", "Lendo", "Em espera", "Lido", "Planejo ler"]}
            onMenuItemSelected={(index, _) => {
              book.status = index;
              book.lastStatus = new Date();
              updateBook({ status: index, lastStatus: book.lastStatus });
            }}
          />
        </Box>

        <Divider sx={{ marginTop: "16px", marginBottom: "16px" }} />

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            padding: "8px 16px",
          }}
        >
          <Typography flexGrow={1} component="legend">
            Nota
          </Typography>
          <Rating
            name="rating"
            defaultValue={book.userRating ? book.userRating : 0}
            max={10}
            onChange={(_, value) => {
              book.userRating = value;
              updateBook({ userRating: book.userRating });
            }}
          />
        </Box>
        <Divider sx={{ marginTop: "16px", marginBottom: "16px" }} />

        <Box
          className="flex-center"
          sx={{
            padding: "0 16px",
            justifyContent: "space-evenly",
            marginBottom: "16px",
          }}
        >
          <Tooltip title="Favoritar">
            <IconButton
              size="large"
              onClick={() => {
                book.favorite = !book.favorite;
                updateBook({ favorite: book.favorite });
              }}
              sx={{
                color: favTextColor,
                backgroundColor: favBgColor,
                margin: "16px",
              }}
            >
              <FavoriteBorderOutlined />
            </IconButton>
          </Tooltip>

          <Tooltip title="Deletar">
            <IconButton
              size="large"
              color="error"
              onClick={() => {
                setDeleteModalOpen(true);
              }}
              sx={{
                backgroundColor: "#FFEBEE",
                margin: "16px",
              }}
            >
              <DeleteOutlineOutlined />
            </IconButton>
          </Tooltip>
          <Modal
            open={openDeleteModal}
            onClose={handleCloseModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={modalStyle}>
              <Typography id="modal-modal-title" variant="h4" component="h2">
                Atenção
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                Tem absoluta certeza de que deseja deletar este livro da sua
                lista? Seu progresso não será preservado.
              </Typography>
              <Button
                variant="text"
                color="error"
                onClick={() => {
                  setDeleteModalOpen(false);
                  userBookManager.deleteUserBook(book).then(() => {
                    book.status = BookStatus.NotAdded;
                    book.progress = 0;
                    setBook({ ...book });
                  });
                }}
                sx={{ mt: 2, fontWeight: "700" }}
              >
                Deletar
              </Button>
              <Button
                variant="text"
                onClick={() => {
                  setDeleteModalOpen(false);
                }}
                sx={{ mt: 2, fontWeight: "700", color: "black" }}
              >
                Cancelar
              </Button>
            </Box>
          </Modal>

          <Tooltip title="Compartilhar">
            <IconButton
              size="large"
              color="secondary"
              onClick={() => {
                const url = book.infoLink
                  ? book.infoLink
                  : encodeURIComponent(book.title);
                let text = `Dê uma olhada neste livro.\n
                Meu status atual é: ${parseBookStatus(book.status)}.\n
                (${book.progress} de ${book.pageCount} páginas)`;
                window.open(`https://t.me/share/url?url=${url}&text=${text}`);
              }}
              sx={{
                backgroundColor: "#E8EAF6",
                margin: "16px",
              }}
            >
              <Share />
            </IconButton>
          </Tooltip>
        </Box>
      </Paper>
    );
  };

  const updateBook = (data: UpdateData<IUserBook>) => {
    if (book == null) return;
    data.lastModified = new Date();
    book.lastModified = new Date();

    userBookManager
      .updateUserBook(book.id, data)
      .then(() => setBook({ ...book }))
      .catch((error) => console.log(error));
  };

  return (
    <ShelfeDrawer selectedIndex={1}>
      <Container fixed>
        <Grid container spacing={4} rowSpacing={3}>
          <LeftGrid book={book} />
          <RightGrid />
        </Grid>
      </Container>
    </ShelfeDrawer>
  );
}

function EmptyState() {
  return (
    <Box
      className="flex-center"
      sx={{
        flexDirection: "column",
        marginTop: "-240px",
      }}
    >
      <img
        id="empty-state-image"
        src={noResults}
        alt="O volume não foi encontrado"
      />
      <Typography
        color="rgba(0,0,0,.54)"
        marginTop="24px"
        variant="h4"
        textAlign="center"
      >
        O volume não foi encontrado
      </Typography>
    </Box>
  );
}

function LeftGrid(props: BookProps) {
  const book = props.book;
  return (
    <Grid
      item
      sm={12}
      md={book?.status === BookStatus.NotAdded ? 7 : 6}
      sx={{ transition: "300ms" }}
    >
      <Typography variant="h4" marginTop="-64px">
        {book ? book.title : <Skeleton width={240} />}
      </Typography>

      <Typography variant="body1" color="rgba(0, 0, 0, .54)">
        {book ? book.authors.join(", ") : <Skeleton width={160} />}
      </Typography>
      <Typography variant="body2" marginTop="36px">
        {book ? (
          new DOMParser().parseFromString(book.description, "text/html").body
            .firstChild?.textContent
        ) : (
          <Skeleton width={240} height={160} />
        )}
      </Typography>

      <Box sx={{ marginTop: "24px", marginBottom: "24px" }}>
        {book ? (
          book.categories.map((category) => {
            return (
              <Chip
                label={category}
                variant="outlined"
                color="primary"
                key={category}
                sx={{
                  marginRight: "8px",
                  marginTop: "8px",
                  color: "#000000",
                  backgroundColor: "rgba(105, 208, 2010, .24)",
                }}
              />
            );
          })
        ) : (
          <Skeleton width={240} />
        )}
      </Box>

      <Divider sx={{ marginTop: "36px", marginBottom: "36px" }} />

      <DataRow
        title="Data de publicação"
        value={book?.publishedAt.toLocaleDateString()}
      />
      <DataRow title="Editora" value={book?.publisher} />
      <DataRow title="Número de páginas" value={book?.pageCount.toString()} />
      <DataRow title="Idioma" value={book?.language} />
      <DataRow title="ISBN" value={book?.isbn ? book?.isbn : ""} />
      <br />
      <br />
    </Grid>
  );
}

function DataRow(props: DataRowProps) {
  return (
    <Box style={{ display: "flex", marginBottom: "4px" }}>
      <Typography variant="body2" fontWeight="700">
        {props.value ? props.title : <Skeleton width={240} />}
      </Typography>
      <Typography
        color="rgba(0,0,0,.54)"
        variant="body2"
        align="right"
        flexGrow={1}
      >
        {props.value ? props.value : <Skeleton width={240} />}
      </Typography>
    </Box>
  );
}

interface DataRowProps {
  title: string;
  value: string | undefined;
}

interface BookProps {
  book: IUserBook | null;
}
