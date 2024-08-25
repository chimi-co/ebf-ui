import { configureStore, createSlice } from '@reduxjs/toolkit';

const appSlice = createSlice({
  name: 'app',
  initialState: {
    chain: import.meta.env.MODE === 'development' ? {eip155: 11155111, name: 'Sepolia'} : {eip155: 42161, name: 'Arbitrum'},
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
