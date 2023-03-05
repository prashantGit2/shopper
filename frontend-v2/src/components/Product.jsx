import {
  Card,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import React from "react";
import ReactStars from "react-rating-stars-component";
import { Link } from "react-router-dom";
import placeholderImage  from "../assets/default_product.png"
const options = {
  edit: false,
  activeColor: "#f7d136",
  color: "rgba(20,20,20,0.1)",
  isHalf: true,
};
const Product = ({ product }) => {
  const { name, _id, images, price,ratings,numOfReviews } = product;
  return (
    <Link to={`/product/${product._id}`} >
      <Card
        sx={{ maxWidth: 500, width: 300, bgcolor: "white" }}
        className="blur-bg t-1"
      >
        <CardMedia sx={{ height: 150 }} image={images[0].url?? placeholderImage } title={name}   />
        <CardContent
          sx={{
            p: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography gutterBottom variant="h6" mb={0} component="div">
            {name}
          </Typography>
          <ReactStars {...options} value={ratings} />
          <Typography>{`${numOfReviews} ${numOfReviews > 1 ? "reviews": "review"}`}</Typography>

          <Typography
            variant="h6"
            fontWeight={"bold"}
            color="secondary"
            sx={{ p: 1, borderRadius: 5, bgcolor: "antiquewhite" }}
            className="blur-bg"
          >
            &#8377;{price}
          </Typography>
        </CardContent>
      </Card>
    </Link>
  );
};

export default Product;
