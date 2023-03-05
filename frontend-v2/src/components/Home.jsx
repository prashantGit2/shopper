import ViewCompactIcon from "@mui/icons-material/ViewCompact";
import { Button, Container, Stack, Typography } from "@mui/material";
import React, { useEffect } from "react";
import Product from "./Product";
import MetaData from "./layouts/MetaData"
import {useDispatch, useSelector} from "react-redux"
import { getProducts } from "../rtk-slice/productSlice";

const Home = () => {
  const {products, loading,error, productsCount} = useSelector(state => state.product)
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(getProducts())
  }, [])
  if (loading) return <p>loading..</p>
  return (
    <>
    <MetaData title={"Shopper"} />
      <Stack
        className="banner"
        sx={{
          paddingTop: 10,
          height: "100vmin",
          justifyContent: "center",
          alignItems: "center",
          gap: 3,
        }}
      >
        <Typography
          variant="h4"
          display={["none", "flex"]}
          fontWeight={700}
          color="primary"
        >
          Welcome to Shopper
        </Typography>
        <Typography
          variant="h3"
          // color="white"
          color="#000"
          className="blur-bg"
          borderRadius={4}
          sx={{opacity:0.5}}
          p={2}
        >
          Some of the Amazing Products below{" "}
        </Typography>
        <Button
          variant="outlined"
          sx={{ p: 1 }}
          color="primary"
          href="#feat-products"
          endIcon={<ViewCompactIcon />}
        >
          View Products
        </Button>
      </Stack>

      <Typography
        variant="h4"
        sx={{
          textAlign: "center",
          width: "35vmax",
          borderBottom: "1px solid black",
          margin: "5vmax auto",
          padding: 1,
        }}
        color="white"
        id="feat-products"
      >
        Featured Products
      </Typography>
      <Container >
        <Stack direction="row" sx={{flexWrap:"wrap", justifyContent: "center"}} gap={3} >
          {products && products.slice(0,6).map((product) => (
            <Product product={product} />
          ))}
        </Stack>
      </Container>
    </>
  );
};

export default Home;
