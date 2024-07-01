import { configureStore, createSlice } from '@reduxjs/toolkit';

const appSlice = createSlice({
  name: 'app',
  initialState: {
    chain: {eip155: 11155111, name: 'Sepolia'},
    provider: null,
    walletAddress: null,
    web3: null,
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
    setWeb3: (state, action) => {
      state.web3 = action.payload
    },
  }
});

export const { setChain, setProvider, setWalletAddress, setWeb3 } = appSlice.actions

const store = configureStore({
  reducer: {
    app: appSlice.reducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({serializableCheck: false})
})

export default store
