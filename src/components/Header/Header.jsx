import React, { useContext, useState } from "react";
import "./Header.css";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { LoginConfigContext } from "../../config/LoginConfigContextProvider";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { AccountBoxRounded, AssignmentIndRounded, AssignmentRounded, Folder, GroupsRounded, HomeRounded, Inventory, InventoryRounded, Logout, LogoutRounded, PeopleAltRounded } from "@mui/icons-material";
import { GridMenuIcon } from "@mui/x-data-grid";

const Header = () => {
  // isLogin : 로그인 여부 - Y(true), N(false)
  // logout() : 로그아웃 함수 - setLogin(false)
  // const { isLogin, login, logout } = useContext(LoginContext);
  const { logout } = useContext(LoginConfigContext);
  // const isLogin = useSelector((state) => {
  //   return state.isLogin.value;
  // });

  const userName = useSelector((state) => {
    return state.userInfo.info.userName.substring(0, 1).toUpperCase();
  })

  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuOpen = () => {
    setDrawerOpen(true);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setDrawerOpen(false);
  };

  const handleProfile = () => {
    navigate("/user/profile");
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      id={menuId}
      keepMounted
      open={Boolean(anchorEl)}
      onClose={handleMenuClose}
      slotProps={{
        paper: {
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&::before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        },
      }}
      transformOrigin={{ horizontal: "right", vertical: "top" }}
      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
    >
      <MenuList>
        <MenuItem onClick={handleProfile}>
          {" "}
          <Avatar /> 프로필
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          로그아웃
        </MenuItem>
      </MenuList>
    </Menu>
  );

  const drawer = (
    <Drawer anchor="left" open={drawerOpen} onClose={handleMenuClose}>
      <Box
        sx={{ width: 250 }}
        role="presentation"
        onClick={handleMenuClose}
        onKeyDown={handleMenuClose}
      >
        <List>
          <ListItem className="mobile__menu__item">
            <HomeRounded style={{marginRight: 10}} />
            <ListItemText
              primary={
              <Typography sx={{ fontFamily: 'GangwonEdu_OTFBoldA' }}>
                홈
              </Typography>
              }
              onClick={() => {
                navigate("/");
              }}
            />
          </ListItem>
          <ListItem>
            <AssignmentRounded style={{marginRight: 10}} />
            <ListItemText
              primary={
              <Typography sx={{ fontFamily: 'GangwonEdu_OTFBoldA' }}>
                출석
              </Typography>
              }
              onClick={() => {
                navigate("/attendances");
              }}
            />
          </ListItem>
          <ListItem>
            <InventoryRounded style={{marginRight: 10}} />
            <ListItemText
              primary={
              <Typography sx={{ fontFamily: 'GangwonEdu_OTFBoldA' }}>
                출석체크
              </Typography>
              }
              onClick={() => {
                navigate("/attendanceCheck");
              }}
            />
          </ListItem>
          <ListItem>
            <PeopleAltRounded style={{marginRight: 10}} />
            <ListItemText
              primary={
              <Typography sx={{ fontFamily: 'GangwonEdu_OTFBoldA' }}>
                회원
              </Typography>
              }
              onClick={() => {
                navigate("/members");
              }}
            />
          </ListItem>
          <ListItem>
            <GroupsRounded style={{marginRight: 10}} />
            <ListItemText
              primary={
              <Typography sx={{ fontFamily: 'GangwonEdu_OTFBoldA' }}>
                그룹
              </Typography>
              }
              onClick={() => {
                navigate("/groups");
              }}
            />
          </ListItem>
          <ListItem>
            <Folder style={{marginRight: 10}} />
            <ListItemText
              primary={
              <Typography sx={{ fontFamily: 'GangwonEdu_OTFBoldA' }}>
                게시판
              </Typography>
              }
              onClick={() => {
                navigate("/minutes");
              }}
            />
          </ListItem>
        </List>
        <Divider />
        <List>
          <ListItem onClick={handleProfile}>
           <AccountBoxRounded style={{marginRight: 10}} />
            <ListItemText primary={
              <Typography sx={{ fontFamily: 'GangwonEdu_OTFBoldA' }}>
                프로필
              </Typography>
            } />
          </ListItem>
          <ListItem onClick={handleLogout}>
            <LogoutRounded style={{marginRight: 10}} />
            <ListItemText primary={
              <Typography sx={{ fontFamily: 'GangwonEdu_OTFBoldA' }}>
                로그아웃
              </Typography>
            } />
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );

  return (
    <div>
      <AppBar
        position="fixed"
        style={{ boxShadow: "0px 0px 0px 1px rgba(0, 0, 0, 0.2)", zIndex: 1000 }}
      >
        <Toolbar className="menu">
          {isMobile && (
            <div className="mobileMenu">
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={handleMobileMenuOpen}
            >
              <GridMenuIcon style={{ color: "black" }} />
            </IconButton>
            <Typography
                className="mobile__menu__title"
                variant="h6"
                noWrap
                sx={{ overflow: "visible", color: "black" }}
              >
                Joshua AM
              </Typography>
            </div>
          )}

          {!isMobile && (
            <div className="menuItems">
              <Typography
                className="menu__title"
                variant="h6"
                noWrap
                sx={{ overflow: "visible", color: "black" }}
              >
                Joshua AM
              </Typography>
              <Box
                sx={{
                  flexGrow: 1,
                  display: "flex",
                  justifyContent: "space-evenly",
                }}
              >
                <Button
                  className="menuItem"
                  color="inherit"
                  onClick={() => {
                    navigate("/");
                  }}
                >
                  홈
                </Button>
                <Button
                  className="menuItem"
                  color="inherit"
                  onClick={() => {
                    navigate("/attendances");
                  }}
                >
                  출석
                </Button>
                <Button
                  className="menuItem"
                  color="inherit"
                  onClick={() => {
                    navigate("/attendanceCheck");
                  }}
                >
                  출석체크
                </Button>
                <Button
                  className="menuItem"
                  color="inherit"
                  onClick={() => {
                    navigate("/members");
                  }}
                >
                  회원
                </Button>
                <Button
                  className="menuItem"
                  color="inherit"
                  onClick={() => {
                    navigate("/groups");
                  }}
                >
                  그룹
                </Button>
                <Button
                  className="menuItem"
                  color="inherit"
                  onClick={() => {
                    navigate("/minutes");
                  }}
                >
                  게시판
                </Button>
              </Box>
              <Box>
                <IconButton
                  className="menuUser"
                  onClick={handleClick}
                  size="small"
                  sx={{ ml: 2 }}
                  aria-controls={open ? "account-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                >
                  <Avatar sx={{ width: 32, height: 32 }}>{userName}</Avatar>
                </IconButton>
              </Box>
            </div>
          )}
        </Toolbar>
      </AppBar>
      {drawer}
      {renderMenu}
    </div>
  );
};

export default Header;
