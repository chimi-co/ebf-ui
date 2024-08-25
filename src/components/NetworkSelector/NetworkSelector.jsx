import {useState} from "react"
import {ChevronDownIcon} from "@heroicons/react/24/solid";
import {useSelector} from "react-redux";

import {useWallets} from "@privy-io/react-auth"

const devChains = [
  {eip155: 11155111, name: 'Sepolia'},
  {eip155: 84532, name: 'Base Sepolia'}
]

const productionChains = [
  {eip155: 42161, name: 'Arbitrum'},
  {eip155: 42220, name: 'Celo'}
]

export default function () {
  const [open, setOpen] = useState(false)

  const chain = useSelector((state) => state.app.chain)
  const {wallets} = useWallets()
  const wallet = wallets[0]

  const handleSelect = async (chain) => await wallet.switchChain(chain.eip155)

  return(
    <div
      className="relative inline-block text-left"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        className="btn btn-text flex">
        {chain?.name ?? 'UNKNOW NETWORK'}
        <ChevronDownIcon className="h-3 w-3 ml-2" />
      </button>
      {
        open && (
          <div
            className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 hover:opacity-100 transition-opacity duration-300 ease-in-out">
            <div className="absolute -top-6 left-0 right-0 h-6 bg-transparent" />
            {(import.meta.env.MODE === 'development' ? devChains : productionChains)
              .map((item) => (
                <button
                  key={item.eip155}
                  className="w-full block px-4 py-2 text-left text-gray-800 hover:bg-gray-100"
                  onClick={() => handleSelect(item)}
                >
                  {item.name}
                </button>
              ))
            }
          </div>
        )
      }
    </div>
  )
}
