import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import Icon from "@mui/material/Icon";
import MDBox from "../../../components/MDBox";
import MDInput from "../../../components/MDInput";
import NotificationItem from "../../../examples/Items/NotificationItem";
import {
  navbar,
  navbarContainer,
  navbarRow,
  navbarIconButton,
  navbarMobileMenu,
} from "../../../examples/Navbars/DashboardNavbar/styles";
import {
  useMaterialUIController,
  setTransparentNavbar,
  setMiniSidenav,
  setOpenConfigurator,
} from "../../../context";
import { useAuth } from "../../../context/userContext";
import { Badge } from "@mui/material";
import MDAvatar from "../../../components/MDAvatar";
import MDTypography from "../../../components/MDTypography";
import { getUserByName } from "../../../services/user";
import Users from "./users";
import useSocketIo from "../../../hooks/useSocketIo";

function DashboardNavbar({ absolute, light, isMini }) {
  const [navbarType, setNavbarType] = useState();
  const [controller, dispatch] = useMaterialUIController();
  const navigate = useNavigate();
  const {
    miniSidenav,
    transparentNavbar,
    fixedNavbar,
    openConfigurator,
    darkMode,
  } = controller;
  const [openMenu, setOpenMenu] = useState(false);
  const [openUsersMenu, setOpenUsersMenu] = useState(false);
  const [search, setSearch] = useState("");
  const inputRef = useRef(null);
  const { user, logout } = useAuth();
  const [users, setUsers] = useState([]);

  const fetchUsers = async (value) => {
    try {
      const response = await getUserByName(value);
      setUsers(response);
      setOpenUsersMenu(response.length > 0);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearch(value);
    if (value.trim() !== "" && !openUsersMenu) {
      setOpenUsersMenu(true);
      fetchUsers(value);
    } else {
      setUsers([]);
      setOpenUsersMenu(false);
    }
  };

  useEffect(() => {
    if (fixedNavbar) {
      setNavbarType("sticky");
    } else {
      setNavbarType("static");
    }

    function handleTransparentNavbar() {
      setTransparentNavbar(
        dispatch,
        (fixedNavbar && window.scrollY === 0) || !fixedNavbar
      );
    }

    window.addEventListener("scroll", handleTransparentNavbar);
    handleTransparentNavbar();

    return () => window.removeEventListener("scroll", handleTransparentNavbar);
  }, [dispatch, fixedNavbar]);

  const handleMiniSidenav = () => setMiniSidenav(dispatch, !miniSidenav);
  const handleConfiguratorOpen = () =>
    setOpenConfigurator(dispatch, !openConfigurator);
  const handleOpenMenu = (event) => setOpenMenu(event.currentTarget);
  const handleCloseMenu = () => setOpenMenu(false);

  // Styles for the navbar icons
  const iconsStyle = ({
    palette: { dark, white, text },
    functions: { rgba },
  }) => ({
    color: () => {
      let colorValue = light || darkMode ? white.main : dark.main;

      if (transparentNavbar && !light) {
        colorValue = darkMode ? rgba(text.main, 0.6) : text.main;
      }

      return colorValue;
    },
  });

  const [notificationsLength, setNotificationsLength] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const { socket } = useSocketIo();
  const id = user._id; // the user id
  useEffect(() => {
    socket?.on("connect", () => {
      socket.emit("setUserId", id);
      // Getting first notifications length
      socket.emit("getNotificationsLength", id);
      socket?.on("notificationsLength", (data) => {
        setNotificationsLength(data);
      });
      socket.emit("getNotifications", id);
      socket?.on("notifications", (data) => {
        setNotifications(data);
      });
      socket?.on("disconnect");
    });

    return () => {
      socket?.off("connect");
      socket?.off("disconnect");
      socket?.off("notifications");
    };
  }, [id, socket]);

  // Render the notifications menu
  const renderMenu = () => (
    <Menu
      anchorEl={openMenu}
      anchorReference={null}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      open={Boolean(openMenu)}
      onClose={handleCloseMenu}
      sx={{ mt: 2 }}
    >
      {notifications.map((notification) => (
        <NotificationItem
          key={notification._id}
          icon={<Icon>podcasts</Icon>}
          title={notification.title}
          onClick={()=> {
            socket.emit("markNotificationAsRead", {notificationId: notification._id, userId: user._id});
            navigate(`/${notification.link}`)}}
        />
      ))}
    </Menu>
  );

  return (
    <AppBar
      position={absolute ? "absolute" : navbarType}
      color="inherit"
      sx={(theme) =>
        navbar(theme, { transparentNavbar, absolute, light, darkMode })
      }
    >
      <Toolbar sx={(theme) => navbarContainer(theme)}>
        <MDBox color="inherit" mb={{ xs: 1, md: 0 }} sx={(theme) => navbarRow(theme, { isMini })}>
          <MDBox pr={2}>
            <MDInput
              label="Search here"
              inputRef={inputRef}
              value={search}
              onChange={handleSearchChange}
             
            />
          </MDBox>
         
        </MDBox>
        {isMini ? null : (
          <MDBox sx={(theme) => navbarRow(theme, { isMini })}>
            {openUsersMenu ? (
              <Users
                users={users}
                user={user}
                inputRef={inputRef}
                setSearch={setSearch}
                setOpenUsersMenu={setOpenUsersMenu}
              />
            ) : (
              <></>
            )}
            <MDBox color={light ? "white" : "inherit"}>
              <Link to="/profile">
                <MDTypography variant="button" color="text" fontWeight="regular">
                  {user.role === "ENTREPRISE"
                    ? user.enterpriseName
                    : user.firstName + " " + user.lastName}
                </MDTypography>
                <IconButton sx={navbarIconButton} size="small" disableRipple>
                  <MDAvatar
                    src={user.image}
                    alt="profile-image"
                    size="xs"
                    shadow="sm"
                  />
                </IconButton>
              </Link>
              <IconButton
                size="small"
                disableRipple
                color="inherit"
                sx={navbarMobileMenu}
                onClick={handleMiniSidenav}
              >
                <Icon sx={iconsStyle} fontSize="medium">
                  {miniSidenav ? "menu_open" : "menu"}
                </Icon>
              </IconButton>
              <IconButton
                size="small"
                disableRipple
                color="inherit"
                sx={navbarIconButton}
                onClick={handleConfiguratorOpen}
              >
                <Icon sx={iconsStyle}>settings</Icon>
              </IconButton>
              <IconButton
                size="small"
                disableRipple
                color="inherit"
                sx={navbarIconButton}
                aria-controls="notification-menu"
                aria-haspopup="true"
                variant="contained"
                onClick={handleOpenMenu}
              >
                <Badge badgeContent={notificationsLength} color="primary">
                  <Icon sx={iconsStyle}>notifications</Icon>
                </Badge>
              </IconButton>
              <IconButton
                size="small"
                disableRipple
                color="inherit"
                sx={navbarIconButton}
                aria-controls="notification-menu"
                aria-haspopup="true"
                variant="contained"
                onClick={logout}
              >
                <Icon sx={iconsStyle}>logout</Icon>
              </IconButton>
              {renderMenu()}
            </MDBox>
          </MDBox>
        )}
      </Toolbar>
    </AppBar>
  );
}

DashboardNavbar.defaultProps = {
  absolute: false,
  light: false,
  isMini: false,
};

DashboardNavbar.propTypes = {
  absolute: PropTypes.bool,
  light: PropTypes.bool,
  isMini: PropTypes.bool,
};

export default DashboardNavbar;
