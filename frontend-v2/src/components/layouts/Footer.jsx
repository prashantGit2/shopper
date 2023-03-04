import React from "react";
import { Stack, Typography } from "@mui/material";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";
import FacebookIcon from "@mui/icons-material/Facebook";
import playStore from "../../assets/playstore.png";
import appStore from "../../assets/Appstore.png";

// import "./Footer.css";

const Footer = () => {
  return (
    // <footer id="footer">
    //   <div className="leftFooter">
    //     <h4>DOWNLOAD OUR APP</h4>
    //     <p>Download App for Android and IOS mobile phone</p>
    //     <img src={playStore} alt="playstore" />
    //     <img src={appStore} alt="Appstore" />
    //   </div>

    //   <div className="midFooter">
    //     <h1>ECOMMERCE.</h1>
    //     <p>High Quality is our first priority</p>

    //     <p>Copyrights 2021 &copy; MeAbhiSingh</p>
    //   </div>

    //   <div className="rightFooter">
    //     <h4>Follow Us</h4>
    //     <a href="http://instagram.com/meabhisingh">Instagram</a>
    //     <a href="http://youtube.com/6packprogramemr">Youtube</a>
    //     <a href="http://instagram.com/meabhisingh">Facebook</a>
    //   </div>
    // </footer>
    <Stack
      direction={["column", "row"]}
      className="blur-bg"
      sx={{
        justifyContent: "space-between",
        marginTop: "10vmax",
        padding: "2vmax",
        color: "white",
        gap:3,
        alignItems: "center",
      }}
    >
      <Stack className="leftFooter">
        <Typography variant="h4" textAlign="center" >DOWNLOAD OUR APP</Typography>
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

      <Stack sx={{ alignItems: "center" }}>
        <Typography variant="h1" fontFamily={"monospace"} >
          Shopper
        </Typography>
        <Typography variant="h6">Store for every need</Typography>
        <Typography variant="subtitle1">
          Copyrights 2023 &copy; Shopper
        </Typography>
      </Stack>

      <Stack>
        <Typography variant="h4" display={["none","flex"]}>Follow Us Here</Typography>
        <Stack direction="row" gap={1} sx={{justifyContent:{xs:"center",md:"flex-start"}}}>
          <FacebookIcon />
          <InstagramIcon />
          <YouTubeIcon />
        </Stack>
      </Stack>
    </Stack>
  );
};

export default Footer;
