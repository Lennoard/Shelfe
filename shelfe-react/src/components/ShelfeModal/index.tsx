
import { Box, Button, Modal, Typography } from "@mui/material";
import { useState } from "react";

export default function ShelfeModal(props: ModalProps) {
  const [openModal, setModalOpen] = useState(props.open);
  const handleCloseModal = () => setModalOpen(false);

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
    <Modal
      open={openModal}
      onClose={handleCloseModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={modalStyle}>
        <Typography id="modal-modal-title" variant="h4" component="h2">
          {props.title}
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          {props.message}
        </Typography>

        {props.customLayout ?? <Box></Box>}

        <Button
          variant="text"
          color="error"
          onClick={(e) => {
            setModalOpen(false);
            if (props.onPositiveButtonClicked) {
              props.onPositiveButtonClicked(e);
            }
          }}
          sx={{ mt: 2, fontWeight: "700" }}
        >
          {props.positiveText}
        </Button>
        <Button
          variant="text"
          onClick={(e) => {
            setModalOpen(false);
            if (props.onNegativeButtonClicked) {
              props.onNegativeButtonClicked(e);
            }
          }}
          sx={{ mt: 2, fontWeight: "700", color: "black" }}
        >
          {props.negativeText ?? "Cancelar"}
        </Button>
      </Box>
    </Modal>
  );
}

interface ModalProps {
  title: string;
  message: string;
  customLayout?: React.ReactNode;
  positiveText: string;
  onPositiveButtonClicked?: React.MouseEventHandler<HTMLButtonElement>;
  negativeText?: string;
  onNegativeButtonClicked?: React.MouseEventHandler<HTMLButtonElement>;
  open: boolean
}
