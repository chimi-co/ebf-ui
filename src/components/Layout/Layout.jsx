import Navbar from "../Navbar/Navbar"
import {Outlet} from "react-router-dom";

export default function Layout () {
  return (
    <div className="min-h-screen flex flex-col">
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