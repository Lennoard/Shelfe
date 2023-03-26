import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  ButtonBase,
  Paper,
  Divider,
  Avatar,
  Modal,
  Snackbar,
  SnackbarCloseReason,
} from "@mui/material";

import ShelfeDrawer from "../../components/ShelfeDrawer";
import { getAuth, User } from "@firebase/auth";
import BrandButton from "../../components/BrandButton";
import { DeleteOutline, ExitToApp } from "@mui/icons-material";
import DeleteAccountUseCase from "../../domain/DeleteAccountUseCase";
import { getFirestore } from "@firebase/firestore";
import ChangePasswordUseCase from "../../domain/ChangePasswordUseCase";
import { IToast } from "../SignIn";
import showLocalizedAuthError from "../../utils/auth/AuthErrors";
import ChangeDisplayNameUseCase from "../../domain/ChangeDisplayNameUseCase";
import ChangeEmailUseCase from "../../domain/ChangeEmailUseCase";

const modalStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 480,
  bgcolor: "background.paper",
  borderRadius: "16px",
  boxShadow: 24,
  p: 4,
};

export default function UserSettings() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [openDeleteAccountModal, setDeleteAccountModalOpen] = useState(false);
  const [openUsernameModal, setUsernameModalOpen] = useState(false);
  const [openPasswordModal, setPasswordModalOpen] = useState(false);
  const [openEmailModal, setEmailModalOpen] = useState(false);
  const [toast, setToast] = useState<IToast>({
    toastOpen: false,
    errorMessage: "Erro",
  });

   const handleToastClose = (
     _: Event | React.SyntheticEvent<any, Event>,
     reason: SnackbarCloseReason
   ) => {
     if (reason === "clickaway") return;
     setToast({ ...toast, toastOpen: false });
   };
    
  useEffect(() => {
    getAuth().onAuthStateChanged((user) => {
      if (!user) {
        navigate("/", { replace: true });
        return;
      }

      setUser(user);
    });
  }, [navigate]);

  const UserSettingsCard = () => {
    if (!user) return <div></div>
    
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
        <Box p={2} display="flex" alignItems="center">
          <Avatar src={user.photoURL ?? ""} sx={{ width: 48, height: 48 }} />

          <Typography variant="subtitle1" marginLeft="24px" flexGrow={1}>
            {user.displayName ?? user.email?.split("@")[0]}
          </Typography>

          <BrandButton
            text="Sair"
            endIcon={<ExitToApp />}
            onClick={() => {
              getAuth().signOut();
            }}
          />
        </Box>

        <Divider />

        <ButtonBase
          sx={{ width: "100%", textAlign: "start", display: "block" }}
          onClick={() => setUsernameModalOpen(true)}
        >
          <Box p={2}>
            <Typography variant="body1" fontWeight="600">
              Nome de usuário
            </Typography>
            <Typography variant="body2" color="rgba(0,0,0,.54)">
              {user.displayName ?? user.email?.split("@")[0]}
            </Typography>
          </Box>
        </ButtonBase>
        <Modal
          open={openUsernameModal}
          onClose={() => setUsernameModalOpen(false)}
        >
          <Box sx={modalStyle}>
            <Typography id="modal-modal-title" variant="h4" component="h2">
              Alterar nome de usuário
            </Typography>

            <br />

            <TextField
              id="new-username"
              key="newUsername"
              type="text"
              label="Nome de usuário"
              sx={{ width: "100%" }}
              required
            />
            <br />

            <Button
              variant="text"
              color="primary"
              onClick={() => {
                let newUsername = (
                  document.getElementById("new-username") as HTMLInputElement
                ).value;
                setUsernameModalOpen(false);
                new ChangeDisplayNameUseCase()
                  .execute(getAuth(), newUsername)
                  .then(() => {
                    setToast({
                      toastOpen: true,
                      errorMessage: "Nome de usuário alterado",
                    });
                  })
                  .catch((e: Error) => {
                    setToast({
                      toastOpen: true,
                      errorMessage:
                        "Falha ao alterar nome de usuário: " +
                        showLocalizedAuthError(e.message),
                    });
                  });
              }}
              sx={{ mt: 2, fontWeight: "700" }}
            >
              OK
            </Button>
            <Button
              variant="text"
              onClick={() => {
                setUsernameModalOpen(false);
              }}
              sx={{ mt: 2, fontWeight: "700", color: "black" }}
            >
              Cancelar
            </Button>
          </Box>
        </Modal>

        <Divider />

        <ButtonBase
          sx={{ width: "100%", textAlign: "start", display: "block" }}
          onClick={() => setEmailModalOpen(true)}
        >
          <Box p={2}>
            <Typography variant="body1" fontWeight="600">
              Email
            </Typography>
            <Typography variant="body2" color="rgba(0,0,0,.54)">
              {user.email}
            </Typography>
          </Box>
        </ButtonBase>
        <Modal open={openEmailModal} onClose={() => setEmailModalOpen(false)}>
          <Box sx={modalStyle}>
            <Typography id="modal-modal-title" variant="h4" component="h2">
              Alterar email
            </Typography>

            <br />

            <TextField
              id="new-email"
              key="newEmail"
              type="text"
              label="Email"
              sx={{ width: "100%" }}
              required
            />
            <br />

            <Button
              variant="text"
              color="primary"
              onClick={() => {
                let newUsername = (
                  document.getElementById("new-email") as HTMLInputElement
                ).value;
                setEmailModalOpen(false);
                new ChangeEmailUseCase()
                  .execute(getAuth(), newUsername)
                  .then(() => {
                    setToast({
                      toastOpen: true,
                      errorMessage: "Email alterado",
                    });
                  })
                  .catch((e: Error) => {
                    setToast({
                      toastOpen: true,
                      errorMessage:
                        "Falha ao alterar email: " +
                        showLocalizedAuthError(e.message),
                    });
                  });
              }}
              sx={{ mt: 2, fontWeight: "700" }}
            >
              OK
            </Button>
            <Button
              variant="text"
              onClick={() => {
                setEmailModalOpen(false);
              }}
              sx={{ mt: 2, fontWeight: "700", color: "black" }}
            >
              Cancelar
            </Button>
          </Box>
        </Modal>

        <Divider />

        <ButtonBase
          sx={{ width: "100%", textAlign: "start", display: "block" }}
          onClick={() => setPasswordModalOpen(true)}
        >
          <Box p={2}>
            <Typography variant="body1" fontWeight="600">
              Alterar senha
            </Typography>
            <Typography variant="body2" color="rgba(0,0,0,.54)">
              ******
            </Typography>
          </Box>
        </ButtonBase>
        <Modal
          open={openPasswordModal}
          onClose={() => setPasswordModalOpen(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={modalStyle}>
            <Typography id="modal-modal-title" variant="h4" component="h2">
              Alterar senha
            </Typography>

            <br />

            <TextField
              id="new-pass"
              key="newPass"
              type="password"
              label="Nova senha"
              sx={{ width: "100%" }}
              required
            />
            <br />

            <Button
              variant="text"
              color="primary"
              onClick={() => {
                let newPass = (
                  document.getElementById("new-pass") as HTMLInputElement
                ).value;
                setPasswordModalOpen(false);
                new ChangePasswordUseCase()
                  .execute(getAuth(), newPass)
                  .then(() => {
                    setToast({
                      toastOpen: true,
                      errorMessage: "Senha alterada",
                    });
                  })
                  .catch((e: Error) => {
                    setToast({
                      toastOpen: true,
                      errorMessage:
                        "Falha ao alterar senha: " +
                        showLocalizedAuthError(e.message),
                    });
                  });
              }}
              sx={{ mt: 2, fontWeight: "700" }}
            >
              OK
            </Button>
            <Button
              variant="text"
              onClick={() => {
                setPasswordModalOpen(false);
              }}
              sx={{ mt: 2, fontWeight: "700", color: "black" }}
            >
              Cancelar
            </Button>
          </Box>
        </Modal>
      </Paper>
    );
  };

  return (
    <ShelfeDrawer title="Configurações" selectedIndex={2}>
      <Container fixed>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginX: {
              xs: "0px",
              sm: "16px",
              md: "24px",
              lg: "128px",
            },
          }}
        >
          <UserSettingsCard /> <br /> <br />
          <BrandButton
            text="Deletar conta"
            backgroundColor="#FFEBEE"
            hoverColor="#ffcdd2"
            textColor="#FF1744"
            endIcon={<DeleteOutline color="error" />}
            onClick={() => {
              setDeleteAccountModalOpen(true);
            }}
          />
          <Modal
            open={openDeleteAccountModal}
            onClose={() => setDeleteAccountModalOpen(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={modalStyle}>
              <Typography id="modal-modal-title" variant="h4" component="h2">
                Atenção
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                Tem absoluta certeza de que deseja deletar a sua conta? Esta
                operação não poderá ser desfeita e seus dados não serão
                preservados!
              </Typography>
              <Button
                variant="text"
                color="error"
                onClick={() => {
                  setDeleteAccountModalOpen(false);
                  new DeleteAccountUseCase().execute(getAuth(), getFirestore());
                }}
                sx={{ mt: 2, fontWeight: "700" }}
              >
                Deletar
              </Button>
              <Button
                variant="text"
                onClick={() => {
                  setDeleteAccountModalOpen(false);
                }}
                sx={{ mt: 2, fontWeight: "700", color: "black" }}
              >
                Cancelar
              </Button>
            </Box>
          </Modal>
          <Snackbar
            open={toast.toastOpen}
            autoHideDuration={3000}
            onClose={handleToastClose}
            message={toast.errorMessage}
          />
        </Box>
      </Container>
    </ShelfeDrawer>
  );
}
