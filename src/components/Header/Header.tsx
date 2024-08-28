import React, { useState } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  Container,
  Button,
  MenuItem,
  Link,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import "./Header.css";

const pages = ["👣 Roadmap", "📚 Courses"];

const SurveyButton = () => (
  <Link
    target="_blank"
    href="https://docs.google.com/forms/d/e/1FAIpQLSd_Yg7ntFhNU9JW9iL56sHIH3lrNmE-pIDx6l41eGkWpjw7Mg/viewform?usp=sf_link"
    underline="none"
  >
    <Button variant="contained" color="primary" sx={{ fontSize: "1em" }}>
      😊 Survey
    </Button>
  </Link>
);

function Header() {
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <AppBar color="inherit">
      <Container maxWidth="lg" sx={{ paddingX: "16px" }}>
        <Toolbar
          disableGutters
          sx={{ display: "flex", justifyContent: "space-between" }}
        >
          <a className="logo">NTUROADMAPS</a>
          <Box sx={{ display: { xs: "flex", sm: "none" } }}>
            <IconButton
              size="large"
              aria-label="open header menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "flex", sm: "none" },
                justifyContent: "center",
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "8px",
                }}
              >
                <SurveyButton />
              </Box>
            </Menu>
          </Box>
          <Box sx={{ display: { xs: "none", sm: "flex" }, gap: "1.5rem" }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={handleCloseNavMenu}
                color="inherit"
                sx={{
                  fontSize: "1em",
                  "&:hover": {
                    borderBottom: "none",
                  },
                }}
              >
                {page}
              </Button>
            ))}
            <SurveyButton />
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Header;
