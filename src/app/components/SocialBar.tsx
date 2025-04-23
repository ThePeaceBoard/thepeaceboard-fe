import React from 'react';
import { Box, IconButton, SxProps, Theme } from "@mui/material";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faGithub, 
  faInstagram, 
  faLinkedin, 
  faDiscord, 
  faTiktok, 
  faXTwitter 
} from '@fortawesome/free-brands-svg-icons';

const iconButtonStyles: SxProps<Theme> = {
  backgroundColor: "rgba(226, 138, 75, 0.05)",
  borderRadius: "50%",
  border: "1.542px solid rgba(226, 138, 75, 0.38)",
  width: "62px",
  height: "62px",
  display: "flex",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.06)",
  transition: "box-shadow 0.3s ease, transform 0.3s ease",
  "&:hover": {
    backgroundColor: "rgba(226, 138, 75, 0.2)",
    boxShadow: "0 10px 15px rgba(0, 0, 0, 0.2), 0 4px 6px rgba(0, 0, 0, 0.1)",
    transform: "translateY(-4px)",
  },
};

const iconStyles = {
  color: "#E28A4B",
  fontSize: "22px",
} as const;

const SocialBar: React.FC = () => {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        marginTop: "25px",
      }}
    >
      <b className="slider guest n6">
        <IconButton
          href="https://www.instagram.com/"
          target="_blank"
          rel="noopener"
          sx={iconButtonStyles}
        >
          <FontAwesomeIcon icon={faInstagram} style={iconStyles} />
        </IconButton>
      </b>
      <b className="slider guest n5">
        <IconButton
          href="https://www.tiktok.com/"
          target="_blank"
          rel="noopener"
          sx={iconButtonStyles}
        >
          <FontAwesomeIcon icon={faTiktok} style={iconStyles} />
        </IconButton>
      </b>
      <b className="slider guest n4">
        <IconButton
          href="https://www.linkedin.com/"
          target="_blank"
          rel="noopener"
          sx={iconButtonStyles}
        >
          <FontAwesomeIcon icon={faLinkedin} style={iconStyles} />
        </IconButton>
      </b>
      <b className="slider guest n3">
        <IconButton
          href="https://discord.com/"
          target="_blank"
          rel="noopener"
          sx={iconButtonStyles}
        >
          <FontAwesomeIcon icon={faDiscord} style={iconStyles} />
        </IconButton>
      </b>
      <b className="slider guest n2">
        <IconButton
          href="https://twitter.com/"
          target="_blank"
          rel="noopener"
          sx={iconButtonStyles}
        >
          <FontAwesomeIcon icon={faXTwitter} style={iconStyles} />
        </IconButton>
      </b>
      <b className="slider guest n1">
        <IconButton
          href="https://github.com/"
          target="_blank"
          rel="noopener"
          sx={iconButtonStyles}
        >
          <FontAwesomeIcon icon={faGithub} style={iconStyles} />
        </IconButton>
      </b>
    </Box>
  );
};

export default SocialBar; 