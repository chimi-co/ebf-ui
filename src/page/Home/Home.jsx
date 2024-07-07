import Web3 from 'web3'
import {usePrivy, useWallets} from "@privy-io/react-auth"
import {useEffect, useState} from "react"

import {useDispatch, useSelector} from "react-redux"
import {setChain, setProvider, setWalletAddress, setWeb3} from "../../store"
import {attest, delegatedAttestationRequest, getAccountBalance} from "../../services/BlockchainService"
import {CONTRACT_CONFIG} from "../../constants/config";

const chains = [
  {eip155: 11155111, name: 'Sepolia'},
  {eip155: 84532, name: 'Base Sepolia'}
]

export default function Home() {

  const dispatch = useDispatch()
  const { user } = usePrivy()
  const {wallets} = useWallets()

  const [balance, setBalance] = useState(0)
  const chain = useSelector((state) => state.app.chain)
  const web3 = useSelector((state) => state.app.web3)

  useEffect(() => {
    const getProvider = async () => {
      const wallet = wallets[0]
      const provider = await wallet?.getEthersProvider()
      const web3Instance = new Web3(provider)

      dispatch(setProvider(provider))
      dispatch(setWeb3(web3Instance))
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
    if(web3) {
      getBalance()
    }
  }, [web3])

  const handleAttestation = async () => await attest()

  const handleDelegatedAttestation = async () => await delegatedAttestationRequest()

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
          <button
            disabled={user && !chain}
            className="btn btn-primary"
            onClick={handleAttestation}
          >
            Attest
          </button>
          <button
            disabled={user && !chain}
            className="btn btn-primary"
            onClick={handleDelegatedAttestation}
          >
            Delegated Attest
          </button>
        </>
      }
    </>
  )

}