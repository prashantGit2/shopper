import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { toast } from 'react-toastify'
const initialState = {
  loading: false,
  error: null,
  products: [],
  product: {},
  productId: null,
  productsCount: 0,
}

export const getProducts = createAsyncThunk(
  'productSlice/getProducts',
  async () => {
    const response = await axios.get("/api/v1/products")
    return response.data
  }
)
export const getProductDetails = createAsyncThunk(
  'productSlice/getProductDetails',
  async (id) => {
    const response = await axios.get(`/api/v1/product/${id}`)
    return response.data
  }
)


export const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProducts.fulfilled, (state, action) => {
        state.products = action.payload.products;
        state.productsCount = action.payload.productsCount
        state.loading = false;
      })
      .addCase(getProducts.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getProducts.rejected, (state, action) => {
        toast.error("Error Fetching Products")
        state.loading = false;
        state.error = true;
      })
      .addCase(getProductDetails.fulfilled, (state, action) => {
        state.product = action.payload.product;
        state.loading = false;
      })
      .addCase(getProductDetails.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getProductDetails.rejected, (state, action) => {
        toast.error("Error Fetching Product Details")
        state.loading = false;
        state.error = true;
      })
  }
})

// Action creators are generated for each case reducer function
export const { clearErrors } = productSlice.actions

export default productSlice.reducer