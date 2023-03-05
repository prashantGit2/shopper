import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
const initialState = {
  loading: false,
  error: null,
  products: [],
  productsCount: 0,
}

export const getProducts = createAsyncThunk(
  'productSlice/getProducts',
  async () => {
    try {
      const response = await axios.get("/api/v1/products")
      return response.data
    } catch (err) {
      return err
      // custom error
    }
  }
)


export const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    increment: (state) => {
      //   state.value += 1
    },
    decrement: (state) => {
      //   state.value -= 1
    },
    incrementByAmount: (state, action) => {
      //   state.value += action.payload
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
        state.loading = false;
      })
  }
})

// Action creators are generated for each case reducer function
export const { increment, decrement, incrementByAmount } = productSlice.actions

export default productSlice.reducer