import {getApplicationState} from "../utils"
import {CONTRACT_CONFIG} from "../constants/config"

export const getAccountBalance = async () => {
  const { walletAddress, web3 } = getApplicationState().app

  const balance = await web3.eth.getBalance(walletAddress)
  return web3.utils.fromWei(balance, 'ether')
}

export const attest = async () => {
  const { chain, walletAddress, web3,  } = getApplicationState().app

  const { EAS_CONTRACT_ADDRESS, SCHEMA_ID, EAS_CONTRACT_ABI } = CONTRACT_CONFIG[chain.eip155]

  console.log({ EAS_CONTRACT_ADDRESS, SCHEMA_ID, EAS_CONTRACT_ABI })

  const easContract = new web3.eth.Contract(EAS_CONTRACT_ABI, EAS_CONTRACT_ADDRESS, {
    from: walletAddress,
  })

  const abi = [
    { type: 'string', name: 'baseSepoliaField'}
  ]

  const encodedData = web3.eth.abi.encodeParameters(abi, [
    'test string'
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
    from: walletAddress,
    to: EAS_CONTRACT_ADDRESS,
    data,
    value: "0",
    gas: 250000,
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
