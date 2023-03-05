import { useEffect } from "react";
import ViewCompactIcon from "@mui/icons-material/ViewCompact";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { Button, Container, Stack, Typography } from "@mui/material";

import { MetaData,Product, Loader  } from "../components";
import { getProducts } from "../rtk-slice/productSlice";
import ErrorIcon from "@mui/icons-material/Error";

const Home = () => {
  const { products, loading, error, productsCount } = useSelector(
    (state) => state.product
  );
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);
  if (loading) return <Loader />;
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
          sx={{ opacity: 0.5 }}
          p={2}
        >
          Some of the Amazing Products below{" "}
        </Typography>
        <Button
          variant="outlined"
          sx={{ p: 1 }}
          color="primary"
          onClick={() => toast("products")}
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
          borderBottom: "1px solid white",
          margin: "5vmax auto",
          padding: 1,
        }}
        color="white"
        id="feat-products"
      >
        Featured Products
      </Typography>
      <Container>
        <Stack
          direction="row"
          sx={{ flexWrap: "wrap", justifyContent: "center" }}
          gap={3}
        >
          {products &&
            products
              .slice(0, 6)
              .map((product) => <Product product={product} />)}
          {error && (
            <Stack direction="row" gap={1} color="tomato" alignItems="center">
              <ErrorIcon />
              <Typography variant="body1" fontSize={20}>Error Fetching Products</Typography>
            </Stack>
          )}
        </Stack>
      </Container>
    </>
  );
};

export default Home;
