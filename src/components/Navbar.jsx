import React, { useState, useContext, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Box,
  useTheme,
  Fade,
  Typography,
  Avatar,
} from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const { isLogged } = useContext(AuthContext);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userImage, setUserImage] = useState(null);

  const handleDrawerToggle = () => setMobileOpen((prev) => !prev);

  const navItems = [
    { label: "Home", to: "/" },
    { label: "About", to: "/about" },
    { label: "Privacy Policy", to: "/privacy-policy" },
    { label: "Company Policy", to: "/company-policy" },
  ];

  const authItems = [
    { label: "Login", to: "/login" },
    { label: "Register", to: "/register" },
  ];

  // Fetch user image from localStorage (after registration)
  useEffect(() => {
  const stored = localStorage.getItem("userProfile");
  if (stored) {
    try {
      const storedUser = JSON.parse(stored);
      if(storedUser?.profilePic){
        const imgURL = storedUser.profilePic.url
        setUserImage(imgURL)
      }
    } catch (error) {
      console.error("Failed to parse userProfile from localStorage:", error);
    }
  }
  }, []);

  const drawer = (
    <Fade in={mobileOpen}>
      <Box
        sx={{
          width: { xs: 250, sm: 280 },
          bgcolor: theme.palette.primary.main,
          backgroundImage:
            "linear-gradient(250deg,rgba(179, 229, 252, 1) 0%, rgba(200, 230, 201, 1) 0%)",
          height: "100%",
          color: "#fff",
          p: { xs: 2, sm: 2.5 },
          boxShadow: "inset 0 0 20px rgba(0, 0, 0, 0.3)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box
          sx={{ display: "flex", justifyContent: "flex-end", width: "100%" }}
        >
          <IconButton
            onClick={handleDrawerToggle}
            sx={{
              color: "#fff",
              bgcolor: "#FFCAD4",
              borderRadius: "50%",
              p: { xs: 1, sm: 1.2 },
              "&:hover": {
                bgcolor: "#C2185B",
                boxShadow: "0 0 12px rgba(255,202,212,0.8)",
              },
            }}
          >
            <CloseIcon sx={{ fontSize: { xs: 26, sm: 28 } }} />
          </IconButton>
        </Box>

        <Typography
          variant="h6"
          sx={{
            mt: 2,
            mb: 3,
            color: "#F75270",
            fontFamily: "Poppins",
            fontSize: "1.5rem",
            fontWeight: "bold",
          }}
        >
          Priotama Menu
        </Typography>

        <List sx={{ width: "100%", textAlign: "center" }}>
          {navItems.map((item) => (
            <ListItem disablePadding key={item.label}>
              <ListItemButton
                component={Link}
                to={item.to}
                onClick={handleDrawerToggle}
                sx={{
                  bgcolor:
                    location.pathname === item.to
                      ? theme.palette.primary.dark
                      : "transparent",
                  borderRadius: 3,
                  my: 0.8,
                  py: { xs: 1.2, sm: 1.5 },
                  transition: "all 0.3s ease",
                  "&:hover": {
                    bgcolor: theme.palette.primary.dark,
                    boxShadow: "0 4px 10px rgba(255, 202, 212, 0.6)",
                    transform: "scale(1.05)",
                  },
                  justifyContent: "center",
                }}
              >
                <ListItemText
                  primary={item.label}
                  sx={{
                    color: "#262626",
                    fontWeight: location.pathname === item.to ? 700 : 600,
                    fontSize: { xs: "1.1rem", sm: "1.2rem" },
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}

          {!isLogged ? (
            authItems.map((item) => (
              <ListItem disablePadding key={item.label}>
                <ListItemButton
                  component={Link}
                  to={item.to}
                  onClick={handleDrawerToggle}
                  sx={{
                    bgcolor:
                      item.label === "Register"
                        ? theme.palette.secondary.main
                        : theme.palette.primary.dark,
                    borderRadius: 20,
                    my: 1,
                    py: 1.3,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      bgcolor:
                        item.label === "Register"
                          ? theme.palette.secondary.dark
                          : theme.palette.primary.main,
                    },
                    justifyContent: "center",
                  }}
                >
                  <ListItemText
                    primary={item.label}
                    sx={{
                      color: "#262626",
                      fontWeight: 700,
                      fontSize: { xs: "1rem", sm: "1.1rem" },
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))
          ) : (
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  navigate("/profile");
                  handleDrawerToggle();
                }}
                sx={{ justifyContent: "center" }}
              >
                <Box sx={{ position: "relative" }}>
                  <Avatar src={userImage} sx={{ width: 36, height: 36 }} />
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 2,
                      right: 2,
                      width: 10,
                      height: 10,
                      bgcolor: "green",
                      borderRadius: "50%",
                      border: "2px solid white",
                    }}
                  />
                </Box>
              </ListItemButton>
            </ListItem>
          )}
        </List>
      </Box>
    </Fade>
  );

  return (
    <AppBar
      position="sticky"
      sx={{
        bgcolor: theme.palette.primary.main,
        backgroundImage:
          "linear-gradient(250deg,rgba(179,229,252,1) 0%, rgba(200,230,201,1) 0%)",
        backdropFilter: "blur(15px)",
        py: { xs: 1, sm: 1.5 },
      }}
    >
      <Toolbar
        sx={{
          justifyContent: "space-between",
          maxWidth: "1200px",
          mx: "auto",
          width: "100%",
          flexWrap: "nowrap",
          gap: { xs: 1, sm: 1.5, md: 2 },
        }}
      >
        <Box
          component={Link}
          to="/"
          sx={{ display: "flex", alignItems: "center", textDecoration: "none" }}
        >
          <Box
            component="img"
            sx={{
              height: { xs: "30px", sm: "40px", md: "50px" },
              transition: "transform 0.4s ease, box-shadow 0.4s ease",
            }}
            src="/logo.png"
            alt="Priotama Logo"
          />
        </Box>

        <Box
          sx={{
            display: { xs: "none", sm: "flex" },
            gap: { sm: 1, md: 1.5 },
            alignItems: "center",
          }}
        >
          {navItems.map((item) => (
            <Button
              key={item.label}
              component={Link}
              to={item.to}
              sx={{
                color: "#252525",
                textTransform: "none",
                fontSize: { sm: "0.9rem", md: "1rem" },
                fontWeight: location.pathname === item.to ? 700 : 600,
                px: 2,
                py: 0.5,
                "&:hover": { color: "#F75270" },
              }}
            >
              {item.label}
            </Button>
          ))}

          {/* Auth or User Avatar */}
          {!isLogged ? (
            authItems.map((item) => (
              <Button
                key={item.label}
                component={Link}
                to={item.to}
                sx={{
                  background:
                    item.label === "Register"
                      ? 'linear-gradient(45deg, #FFCAD4 30%, #C2185B 90%)'
                      : theme.palette.primary.dark,
                  color: "#262626",
                  textTransform: "none",
                  fontWeight: 600,
                  borderRadius: 40,
                  px: 2,
                  py: 0.8,
                  "&:hover": {
                    bgcolor:
                      item.label === "Register"
                        ? theme.palette.secondary.dark
                        : theme.palette.primary.main,
                  },
                  position: "relative",
                }}
              >
                {item.label}
              </Button>
            ))
          ) : (
            <Box sx={{ position: "relative", ml: 1 }}>
              <IconButton onClick={() => navigate("/profile")} sx={{ p: 0 }}>
                <Avatar src={userImage || "/default-avatar.png"} sx={{ width: 36, height: 36 }} />
              </IconButton>

              <Box
                sx={{
                  position: "absolute",
                  bottom: 0,
                  right: 2,
                  width: 14,
                  height: 14,
                  bgcolor: "green",
                  borderRadius: "50%",
                  border: '2px solid #fff',
                  animation: 'blink 3s infinite',
                  "@keyframes blink": {
                    "0%, 50%, 100%": { opacity: 1 },
                    "25%, 75%": { opacity: 0 },
                  },
                }}
              />
            </Box>
          )}
        </Box>

        {/* Mobile Menu Icon */}
        <IconButton
          color="inherit"
          edge="end"
          onClick={handleDrawerToggle}
          sx={{
            display: { sm: "none" },
            bgcolor: "#FFCAD4",
            borderRadius: "50%",
            p: { xs: 1.2, sm: 1.5 },
            "&:hover": {
              bgcolor: "#C2185B",
              boxShadow: "0 0 12px rgba(255,202,212,0.8)",
            },
          }}
        >
          <MenuIcon sx={{ fontSize: { xs: 30, sm: 32 }, color: "#fff" }} />
        </IconButton>
      </Toolbar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{ display: { sm: "none" } }}
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
}
