import React from "react";
import { Box, Typography, Link, IconButton } from "@mui/material";
import CopyrightIcon from "@mui/icons-material/Copyright";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";
import InstagramIcon from "@mui/icons-material/Instagram";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        textAlign: "center",
        py: 3,
        mt: 4,
        borderTop: (theme) => `1px solid ${theme.palette.divider}`,
        backgroundColor: (theme) => theme.palette.background.paper,
      }}
    >
      {/* Social Media Links */}
      <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mb: 2 }}>
        <IconButton
          component={Link}
          href="https://www.linkedin.com/in/leelavardhan/"
          target="_blank"
          rel="noopener"
          aria-label="LinkedIn"
          sx={{
            color: "text.primary",
            "&:hover": {
              color: "primary.main",
              transform: "scale(1.1)",
              transition: "all 0.3s ease",
            },
          }}
        >
          <LinkedInIcon fontSize="large" />
        </IconButton>
        <IconButton
          component={Link}
          href="https://github.com/Leelavardhankommanaboyina"
          target="_blank"
          rel="noopener"
          aria-label="GitHub"
          sx={{
            color: "text.primary",
            "&:hover": {
              color: "primary.main",
              transform: "scale(1.1)",
              transition: "all 0.3s ease",
            },
          }}
        >
          <GitHubIcon fontSize="large" />
        </IconButton>
        <IconButton
          component={Link}
          href="https://www.instagram.com/accounts/login/?hl=en"
          target="_blank"
          rel="noopener"
          aria-label="Instagram"
          sx={{
            color: "text.primary",
            "&:hover": {
              color: "primary.main",
              transform: "scale(1.1)",
              transition: "all 0.3s ease",
            },
          }}
        >
          <InstagramIcon fontSize="large" />
        </IconButton>
      </Box>
      {/* Copyright */}
      <Typography variant="body2" color="text.secondary">
        <CopyrightIcon fontSize="small" sx={{ verticalAlign: "middle" }} />
        {" ALL RIGHTS RESERVED BY KOMMANABOYINA LEELAVARDHAN 2025"}
      </Typography>
    </Box>
  );
};

export default Footer;
