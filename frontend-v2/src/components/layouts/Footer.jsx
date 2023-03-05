import React from "react";
import { Button, ButtonGroup, Stack, Typography } from "@mui/material";

// social icons
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";
import FacebookIcon from "@mui/icons-material/Facebook";

// get app store logo
import playStore from "../../assets/playstore.png";
import appStore from "../../assets/Appstore.png";

const Footer = () => {
  return (
    <Stack
      direction={["column", "row"]}
      className="blur-bg"
      sx={{
        justifyContent: "space-between",
        boxShadow:"7px -6px 16px -5px rgba(0,0,0,0.75)",
        marginTop: "10vmax",
        padding: "2vmax",
        color: "white",
        gap: 3,
        alignItems: "center",
      }}
    >
      <Stack className="leftFooter">
        <Typography variant="h4" textAlign="center">
          DOWNLOAD OUR APP
        </Typography>
        <Stack gap={5} direction="row" m={1}>
          <img
            src={playStore}
            alt="playstore"
            width={150}
            style={{ cursor: "pointer" }}
          />
          <img
            src={appStore}
            alt="Appstore"
            width={150}
            style={{ cursor: "pointer" }}
          />
        </Stack>
      </Stack>

      <Stack sx={{ alignItems: "center" } } >
        <Typography variant="h1" fontFamily={"monospace"} color="primary">
          Shopper
        </Typography>
        <Typography variant="h6">Store for every need</Typography>
        <Typography variant="subtitle1">
          Copyrights 2023 &copy; Shopper
        </Typography>
      </Stack>

      <Stack>
        <Typography variant="h4" display={["none", "flex"]}>
          Follow Us Here
        </Typography>
        <Stack
          direction="row"
          gap={1}
          sx={{ justifyContent: { xs: "center", md: "flex-start" } }}
        >
          <ButtonGroup variant="secondary">
            <Button>
              <FacebookIcon />
            </Button>
            <Button>
              <InstagramIcon />
            </Button>
            <Button>
              <YouTubeIcon />
            </Button>
          </ButtonGroup>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default Footer;
