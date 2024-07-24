import {usePrivy, useWallets} from "@privy-io/react-auth"
import {BrowserProvider} from "ethers"
import {useEffect, useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import {useNavigate} from "react-router-dom"

import {delegatedAttestationRequest, getAccountBalance} from "../../services/BlockchainService"
import {setChain, setProvider, setWalletAddress} from "../../store"

import {CONTRACT_CONFIG} from "../../constants/config"

const chains = [
  {eip155: 11155111, name: 'Sepolia'},
  {eip155: 84532, name: 'Base Sepolia'}
]

export default function Home() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = usePrivy()
  const {wallets} = useWallets()

  const [balance, setBalance] = useState(0)
  const [inputValue, setInputValue] = useState('')
  const chain = useSelector((state) => state.app.chain)
  const provider = useSelector((state) => state.app.provider)

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

  useEffect(() => {
    const getBalance = async () => {
      const balance = await getAccountBalance()
      setBalance(balance)
    }
    if(provider) {
      getBalance()
    }
  }, [provider])

  const handleDelegatedAttestation = async () => {
    await delegatedAttestationRequest(inputValue)
    setInputValue('')
  }

  const goToQuestions = () => {
    navigate(`/users/${user?.wallet?.address}/surveys`)
  }

  return(
    <>
      <h2 className="text-2xl font-semibold mb-4">Main Content</h2>
      <p>This is the main content area.</p>
      {user &&
        <>
          <div className="py-6">
            <p>Wallet address: {user?.wallet?.address}</p>
            <p>Account balance: {balance} ETH</p>
            <p>eip155: {chain?.eip155}</p>
            <p>EAS contract: {CONTRACT_CONFIG[chain?.eip155].EAS_CONTRACT_ADDRESS}</p>
            <p>SchemaId: {CONTRACT_CONFIG[chain?.eip155].SCHEMA_ID}</p>
          </div>
          <div className="flex flex-col p-2">
            <label>What's your name?</label>
            <input value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="Type your name here"/>
          </div>
          <button
            disabled={user && !chain}
            className="btn btn-primary"
            onClick={handleDelegatedAttestation}
          >
            Delegated Attest
          </button>
          <button
            className="btn btn-primary"
            onClick={goToQuestions}
          >
            Go to surveys
          </button>
        </>
      }
    </>
  )

}