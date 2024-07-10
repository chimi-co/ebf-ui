import { configureStore, createSlice } from '@reduxjs/toolkit';

const appSlice = createSlice({
  name: 'app',
  initialState: {
    chain: {eip155: 11155111, name: 'Sepolia'},
    provider: null,
    walletAddress: null,
  },
  reducers: {
    setChain: (state, action) => {
      state.chain = action.payload
    },
    setProvider: (state, action) => {
      state.provider = action.payload
    },
    setWalletAddress: (state, action) => {
      state.walletAddress = action.payload
    },
  }
});

export const { setChain, setProvider, setWalletAddress } = appSlice.actions

const store = configureStore({
  reducer: {
    app: appSlice.reducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({serializableCheck: false})
})

export default store
