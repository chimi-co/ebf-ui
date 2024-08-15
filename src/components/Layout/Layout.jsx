import {usePrivy, useWallets} from "@privy-io/react-auth"
import {BrowserProvider} from "ethers"
import {useEffect} from "react"
import {Outlet} from "react-router-dom"
import {useDispatch, useSelector} from "react-redux"
import { ToastContainer } from 'react-toastify'

import {setChain, setProvider, setWalletAddress} from "../../store/index.js"

import Navbar from "../Navbar/Navbar"

import 'react-toastify/dist/ReactToastify.css'

const chains = [
  {eip155: 11155111, name: 'Sepolia'},
  {eip155: 84532, name: 'Base Sepolia'}
]

const NetworkAlert = () =>
  <div className="bg-red-100 border border-red-400 text-red-700 text-center px-4 py-3 rounded relative" role="alert">
    <strong className="font-bold">Network error. </strong>
    <span className="block sm:inline">Select an available network.</span>
  </div>

export default function Layout () {
  const dispatch = useDispatch()
  const { user } = usePrivy()
  const {wallets} = useWallets()
  const chain = useSelector((state) => state.app.chain)

  useEffect(() => {
    const getProvider = async () => {
      const wallet = wallets[0]
      const ethereum = await wallet.getEthereumProvider();
      const ethers6Provider = new BrowserProvider(ethereum);

      dispatch(setProvider(ethers6Provider))
      dispatch(setWalletAddress(wallet.address))
      dispatch(setChain(chains.find(item => item.eip155 === Number(wallet.chainId.split(':')[1]))))
    }
    if(user && !!wallets.length) {
      getProvider()
    }
  }, [user, wallets])

  return (
    <div className="min-h-screen h-screen flex flex-col">
      {user && !chain && <NetworkAlert/>}
      <ToastContainer />

      <Navbar/>

      <main id="main" className="flex-grow container mx-auto px-4 py-8">
        <Outlet/>
      </main>

      <footer className="bg-neutral py-4">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 Spark Ecosystems.  All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}