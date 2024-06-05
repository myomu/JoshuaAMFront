import React, { useContext, useState } from "react";
import "./Header.css";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { LoginConfigContext } from "../../config/LoginConfigContextProvider";
import { Container, Nav, Navbar, NavbarToggle } from "react-bootstrap";
import { AppBar, Avatar, Box, Button, Divider, Drawer, IconButton, List, ListItem, ListItemText, Menu, MenuItem, MenuList, Popover, Toolbar, Tooltip, Typography, useMediaQuery, useTheme } from "@mui/material";
import { AccountCircle } from "@mui/icons-material";
import { GridMenuIcon } from "@mui/x-data-grid";

const Header = () => {
  // isLogin : 로그인 여부 - Y(true), N(false)
  // logout() : 로그아웃 함수 - setLogin(false)
  // const { isLogin, login, logout } = useContext(LoginContext);
  const { logout } = useContext(LoginConfigContext);
  // const isLogin = useSelector((state) => {
  //   return state.isLogin.value;
  // });

  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  // const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));


  //
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  //

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // const handleMobileMenuOpen = (event) => {
  //   setMobileMoreAnchorEl(event.currentTarget);
  // };

  const handleMobileMenuOpen = () => {
    setDrawerOpen(true);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    // setMobileMoreAnchorEl(null);
    setDrawerOpen(false);
  };

  const handleProfile = () => {
    navigate("/user/profile")
  }

  const handleLogout = () => {
    console.log('Logged out');
    handleMenuClose();
    logout();
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      // anchorOrigin={{ vertical: 'top', horizontal: 'bottom' }}
      id={menuId}
      keepMounted
      // transformOrigin={{ vertical: 'top', horizontal: 'bottom' }}
      open={Boolean(anchorEl)}
      onClose={handleMenuClose}
      
    >
      <Popover
        id={open ? 'simple-popover' : undefined}
        open={open}
        anchorEl={anchorEl}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <MenuList>
          <MenuItem onClick={handleProfile}> <Avatar /> 프로필</MenuItem>
          <MenuItem onClick={handleLogout}>로그아웃</MenuItem>
        </MenuList>
      </Popover>
      
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  // const renderMobileMenu = (
  //   <Menu
  //     anchorEl={mobileMoreAnchorEl}
  //     anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
  //     id={mobileMenuId}
  //     keepMounted
  //     transformOrigin={{ vertical: 'top', horizontal: 'right' }}
  //     open={Boolean(mobileMoreAnchorEl)}
  //     onClose={handleMenuClose}
  //   >
  //     {/* <MenuItem onClick={handleProfileMenuOpen}>
  //       <IconButton
  //         edge="end"
  //         aria-label="account of current user"
  //         aria-controls="primary-search-account-menu"
  //         aria-haspopup="true"
  //         color="inherit"
  //       >
  //         <AccountCircle />
  //       </IconButton>
  //       <p>Profile</p>
  //     </MenuItem> */}
  //     <MenuItem onClick={handleLogout}>Logout</MenuItem>
  //   </Menu>
  // );

  const drawer = (
    <Drawer
      anchor="left"
      open={drawerOpen}
      onClose={handleMenuClose}
    >
      <Box
        sx={{ width: 250 }}
        role="presentation"
        onClick={handleMenuClose}
        onKeyDown={handleMenuClose}
      >
        <List>
          <ListItem >
            <ListItemText primary="홈" onClick={() => { navigate("/") }} />
          </ListItem>
          <ListItem >
            <ListItemText primary="출석" onClick={() => { navigate("/attendances") }} />
          </ListItem>
          <ListItem >
            <ListItemText primary="출석체크" onClick={() => { navigate("/attendanceCheck") }} />
          </ListItem>
          <ListItem >
            <ListItemText primary="회원" onClick={() => { navigate("/members") }} />
          </ListItem>
          <ListItem >
            <ListItemText primary="그룹" onClick={() => { navigate("/groups") }} />
          </ListItem>
        </List>
        <Divider />
        <List>
          <ListItem onClick={handleProfile}>
            <ListItemText primary="프로필" />
          </ListItem>
          <ListItem onClick={handleLogout}>
            <ListItemText primary="로그아웃" />
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );

  return (
    // <div className="header">
    //   {!isLogin ? (
    //     /* 비로그인 시 */
    //     <Navbar bg="light" data-bs-theme="light">
    //         <Navbar.Brand href="/">Joshua AM</Navbar.Brand>
    //         <Nav className="nav text-nowrap">
    //           {/* <Nav.Link href="/">홈</Nav.Link> */}
    //           <Nav.Link onClick={() => { navigate("/login"); }}>
    //             로그인
    //           </Nav.Link>
    //           <Nav.Link onClick={() => { navigate("/join"); }}>
    //             회원가입
    //           </Nav.Link>
    //         </Nav>
    //     </Navbar>
    //   ) : (
    //     /* 로그인 시 */
    //     <Navbar className="navbar">
    //       <Container fluid>
    //         <Navbar.Brand href="/">Joshua AM</Navbar.Brand>
    //         <NavbarToggle />
    //         <Nav className="nav-left text-nowrap">
    //           {/* <Nav.Link href="/">홈</Nav.Link> */}
    //           <Nav.Link className="nav-link" onClick={() => { navigate("/"); }}>
    //             홈
    //           </Nav.Link>
    //           <Nav.Link onClick={() => { navigate("/attendances"); }}>
    //             출석
    //           </Nav.Link>
    //           <Nav.Link onClick={() => { navigate("/attendanceCheck"); }}>
    //             출석체크
    //           </Nav.Link>
    //           <Nav.Link onClick={() => { navigate("/members"); }}>
    //             회원
    //           </Nav.Link>
    //           <Nav.Link onClick={() => { navigate("/groups"); }}>
    //             그룹
    //           </Nav.Link>
    //         </Nav>
    //         <Nav className="nav-right text-nowrap">
    //           <Nav.Link onClick={() => { logout() }}>
    //             로그아웃
    //           </Nav.Link>
    //         </Nav>
    //       </Container>
    //     </Navbar>
    //   )}
    // </div>

    <div>
      <AppBar position="static" style={{marginBottom: "30px"}}>
        <Toolbar>
          {isMobile && (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={handleMobileMenuOpen}
            >
              <GridMenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" noWrap>
            Joshua AM
          </Typography>
          {!isMobile && (
            <div>
            <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end' }}>
              <Button color="inherit" onClick={() => { navigate("/") }} >홈</Button>
              <Button color="inherit" onClick={() => { navigate("/attendances") }} >출석</Button>
              <Button color="inherit" onClick={() => { navigate("/attendanceCheck") }} >출석체크</Button>
              <Button color="inherit" onClick={() => { navigate("/members") }} >회원</Button>
              <Button color="inherit" onClick={() => { navigate("/groups") }} >그룹</Button>
              <IconButton
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>

              {/* <Typography sx={{ minWidth: 100 }}>Contact</Typography> */}
              {/* <Typography sx={{ minWidth: 100 }}>Profile</Typography> */}
              {/* <Tooltip title="계정"> */}
                <IconButton
                onClick={handleClick}
                size="small"
                sx={{ ml: 2 }}
                aria-controls={open ? 'account-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                >
                  <Avatar sx={{ width: 32, height: 32 }}>M</Avatar>
                </IconButton>
              {/* </Tooltip> */}
            </Box>
            {/* <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}> */}
              
            {/* </Box> */}
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
