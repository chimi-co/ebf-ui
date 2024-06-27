import {usePrivy} from "@privy-io/react-auth";

export default function Navbar() {
  const { login, logout, user } = usePrivy()
  return (
    <nav className="flex items-center justify-between flex-wrap bg-secondary p-2">
      <div className="flex items-center mr-6">
        <img alt='logo' src='https://ebfcommons.org/wp-content/uploads/2023/09/EBF-Logo_v1-179.png' width={50}/>
      </div>
      <div className="block lg:hidden">
        <button
          className="flex items-center px-3 py-2 border rounded text-teal-200 border-teal-400 hover:text-white hover:border-white">
          <svg className="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Menu</title>
            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"/>
          </svg>
        </button>
      </div>
      <div className="w-full block flex-grow lg:flex lg:justify-end lg:w-auto">
        <div>
          {user?
            <button className="btn btn-primary" onClick={logout}>Logout</button>
            : <button className="btn btn-primary" onClick={login}>Login</button>
          }
        </div>
      </div>
    </nav>
  )
}