import { Favorite, Star } from "@mui/icons-material";
import { Card, Typography, Box, LinearProgress, ButtonBase } from "@mui/material";
import IUserBook from "../../data/models/book/IUserBook";

import "./style.css";

interface BookCardProps {
  book: IUserBook;
  onClick: () => void;
}

export default function BookCard(props: BookCardProps) {
  const book = props.book;
  const imageUrl = book.imageUrls.length === 0
    ? "https://via.placeholder.com/128x192?text=SEM+IMAGEM"
    : book.imageUrls[0];
  const MIN = 0;
  const maxProgress = book ? book.pageCount : 0;
  const progress = book ? book.progress : 0;
  const normaliseProgress = () =>
    ((progress - MIN) * 100) / (maxProgress - MIN);
  
  return (
    <Card
      onClick={props.onClick}
      sx={{ display: "flex", borderRadius: "12px" }}
    >
      <ButtonBase sx={{ width: "100%" }}>
        <img className="bookCardImage" src={imageUrl} alt="Capa" />
        <div className="bookCardContainer">
          <Typography className="title" marginTop="24px" variant="h6" noWrap>
            {book.title}
          </Typography>

          <Typography variant="body2">{book.authors}</Typography>

          <Typography variant="body2" marginTop="42px">
            {book.progress}/{book.pageCount}
          </Typography>

          <Box>
            <LinearProgress
              variant="determinate"
              color="secondary"
              value={normaliseProgress()}
              sx={{ borderRadius: "16px", height: "8px" }}
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              marginTop: "4px",
              justifyContent: "flex-end",
            }}
          >
            <Star fontSize="small" color="disabled" />
            <Typography variant="body2" mt={0.3} >{book.userRating}</Typography>
          </Box>
        </div>
      </ButtonBase>
    </Card>
  );
}