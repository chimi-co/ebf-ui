import {usePrivy} from "@privy-io/react-auth";
import NetworkSelector from "../NetworkSelector/NetworkSelector";

export default function Navbar() {
  const { login, logout, user } = usePrivy()

  const shortenText = (text ) => {
    if (text?.length <= 8) {
      return text;
    }

    const firstPart = text?.slice(0, 4)
    const lastPart = text?.slice(-4)

    return `${firstPart}....${lastPart}`
  }

  return (
    <nav className="flex items-center justify-between flex-wrap bg-secondary p-2">
      <div className="flex items-center mr-6">
        <img alt='logo' src='https://ebfcommons.org/wp-content/uploads/2023/09/EBF-Logo_v1-179.png' width={50}/>
      </div>
      <div className="block flex-grow flex justify-end w-auto text-xs">
        {user && <NetworkSelector/>}
        {user?
          <button className="btn btn-primary" onClick={logout}>{shortenText(user?.wallet?.address)}</button>
          : <button className="btn btn-primary" onClick={login}>Connect</button>
        }
      </div>
    </nav>
  )
}