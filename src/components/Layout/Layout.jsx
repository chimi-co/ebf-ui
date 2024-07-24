import Navbar from "../Navbar/Navbar"
import {Outlet} from "react-router-dom";
import {usePrivy} from "@privy-io/react-auth";
import {useSelector} from "react-redux"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const NetworkAlert = () =>
  <div className="bg-red-100 border border-red-400 text-red-700 text-center px-4 py-3 rounded relative" role="alert">
    <strong className="font-bold">Network error. </strong>
    <span className="block sm:inline">Select an available network.</span>
  </div>

export default function Layout () {

  const { user } = usePrivy()
  const chain = useSelector((state) => state.app.chain)

  return (
    <div className="min-h-screen h-screen flex flex-col">
      {user && !chain && <NetworkAlert/>}
      <ToastContainer />

      <Navbar/>

      <main className="flex-grow container mx-auto px-4 py-8">
        <Outlet/>
      </main>

      <footer className="bg-neutral py-4">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2023 EBF. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}