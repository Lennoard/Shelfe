import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Avatar, Slide, useScrollTrigger } from "@mui/material";
import { IDrawerItem } from "./IDrawerItem";
import { HomeOutlined, SearchOutlined, SettingsOutlined } from "@mui/icons-material";
import { useHistory } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAuth, User } from "@firebase/auth";

import "./style.css";

const drawerWidth = 320;

const defaultItems = [
  {
    title: "Home",
    icon: <HomeOutlined />,
    route: "/dashboard",
  } as IDrawerItem,
  {
    title: "Pesquisar",
    icon: <SearchOutlined />,
    route: "/search",
  } as IDrawerItem,
  {
    title: "Configurações",
    icon: <SettingsOutlined />,
    route: "/settings",
  } as IDrawerItem,
];

export default function ShelfeDrawer(props: DrawerProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const history = useHistory();
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  useEffect(() => {
    getAuth().onAuthStateChanged(user => setUser(user));
  }, [])

  const drawer = (
    <div>
      {user ? <UserCell user={user} /> : <Toolbar />}
      <List>
        {(props.items ? props.items : defaultItems).map((item, index) => (
          <ListItem
            button
            className={
              index === props.selectedIndex
                ? "shelfeListItem selected"
                : "shelfeListItem"
            }
            key={item.title}
            onClick={() => history.push(item.route)}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.title} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  const container =
    window !== undefined ? () => window.document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <HideOnScroll {...props}>
        <AppBar
          color="transparent"
          position="fixed"
          elevation={0}
          sx={{
            width: { lg: `calc(100% - ${drawerWidth}px)` },
            ml: { lg: `${drawerWidth}px` },
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, mt: 4, display: { lg: "none" } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography marginTop="32px" variant="h4">
              {props.title}
            </Typography>
          </Toolbar>
        </AppBar>
      </HideOnScroll>
      <Box
        component="nav"
        sx={{ width: { lg: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", sm: "block", md: "block", lg: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              backgroundColor: "#2F9FA1",
              borderRadius: "0 24px 24px 0",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "none", md: "none", lg: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              backgroundColor: "#2F9FA1",
              borderRadius: "0 24px 24px 0",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        {props.children}
      </Box>
    </Box>
  );
}

function HideOnScroll(props: AppBarProps) {
  const { children } = props;
  const trigger = useScrollTrigger({
    target: window,
    disableHysteresis: true,
    threshold: 0,
  });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

function UserCell(props: UserCellProps) {
  const user = props.user;

  return (
    <Box p={3}>
      <Avatar
        src={user.photoURL || ""}
        sx={{ width: 80, height: 80, margin: "auto" }}
      />
      <Typography variant="h5" marginTop="8px" textAlign="center">
        {user.displayName ? user.displayName : user.email?.split("@")[0]}
      </Typography>
      <Typography variant="body1" textAlign="center" noWrap>
        {user.email}
      </Typography>
    </Box>
  );
}

interface DrawerProp {
  title: string | null;
  items: IDrawerItem[] | null;
  selectedIndex: number;
  children: React.ReactElement;
}

interface DrawerProps extends Partial<DrawerProp> {}

interface AppBarProps {
  children: React.ReactElement;
}

interface UserCellProps {
  user: User;
}
