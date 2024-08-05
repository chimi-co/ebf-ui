import React from 'react'
import ReactDOM from 'react-dom/client'
import { ConfigProvider } from 'antd'
import { PrivyProvider } from '@privy-io/react-auth'
import { Provider } from 'react-redux'
import {baseSepolia, sepolia} from 'viem/chains'

import store from './store'

import AppRouter from "./router/AppRouter"

import './index.css'

const id = 'clxkss0ur055pocmvq6cdo1xk'
const config = {
  appearance: {
    logo: 'https://ebfcommons.org/wp-content/uploads/2023/09/EBF-Logo_v1-179.png',
    walletList: ['metamask']
  },
  embeddedWallets: {
    createOnLogin: 'users-without-wallets' // defaults to 'off'
  },
  supportedChains: [sepolia, baseSepolia],
}

const themeConfig = {
  token: {
    colorPrimary: '#E94F2B',
    borderRadius: '20px',
  },
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <PrivyProvider appId={id} config={config}>
      <Provider store={store}>
        <ConfigProvider theme={themeConfig}>
          <AppRouter />
        </ConfigProvider>
      </Provider>
    </PrivyProvider>
  </React.StrictMode>,
)
