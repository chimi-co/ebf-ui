import Web3 from 'web3'
import {usePrivy, useWallets} from "@privy-io/react-auth"
import {useEffect, useState} from "react"

import {EAS_CONTRACT_ABI} from "../../constants/abi"
import {EAS_CONTRACT_ADDRESS, SCHEMA_ID} from "../../constants/contracts"

export default function Home() {

  const [accountBalance, setAccountBalance] = useState(0)
  const [web3, setWeb3] = useState(null)
  const { user } = usePrivy()
  const {wallets} = useWallets()


  useEffect(() => {
    const getProvider = async () => {
      const wallet = wallets[0]
      const provider = await wallet?.getEthereumProvider()
      const web3Instance = new Web3(provider);
      setWeb3(web3Instance)
    }
    if(user && !!wallets.length) {
      getProvider()
    }
  }, [user, wallets])

  useEffect(() => {
    const getBalanceAccount = async () => {
      const balance = await web3.eth.getBalance(user.wallet.address)
      setAccountBalance(web3.utils.fromWei(balance, 'ether'))
    }
    if(web3) {
      getBalanceAccount()
    }
  }, [web3])

  const handleAttestation = async () => {
    const easContract = new web3.eth.Contract(EAS_CONTRACT_ABI, EAS_CONTRACT_ADDRESS, {
      from: wallets[0].address,
    })

    const abi = [
      { type: 'string', name: 'testField'}
    ]

    const encodedData = web3.eth.abi.encodeParameters(abi, [
      'test text'
    ])

    const data = await easContract.methods
      .attest({
        schema: SCHEMA_ID,
        data: {
          recipient: "0x0000000000000000000000000000000000000000",
          expirationTime: 0n,
          revocable: false,
          refUID: '0x0000000000000000000000000000000000000000000000000000000000000000',
          data: encodedData,
          value: 0,
        },
      })
      .encodeABI()


    const transaction = {
      from: wallets[0].address,
      to: EAS_CONTRACT_ADDRESS,
      data,
      value: "0",
      gas: 250000, //wei
    }

    await web3.eth
      .sendTransaction(transaction)
      .on("transactionHash", (txHash) => {
        console.log('in Progress', txHash)
      })
      .on("receipt", (receipt) => {
        console.log('on complete', receipt.logs[0].data)
      })
  }

  return(
    <>
      <h2 className="text-2xl font-semibold mb-4">Main Content</h2>
      <p>This is the main content area.</p>
      {user &&
        <>
          <div className="py-6">
            <p>Wallet address: {user?.wallet?.address}</p>
            <p>Account balance: {accountBalance} ETH</p>
          </div>
          <button className="btn btn-primary" onClick={handleAttestation}>Attest</button>
        </>
      }
    </>
  )

}