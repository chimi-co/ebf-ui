import {Delegated, EAS, SchemaEncoder, ZERO_BYTES32} from '@ethereum-attestation-service/eas-sdk';
import {ethers} from 'ethers'

import {getApplicationState} from "../utils"
import {CONTRACT_CONFIG} from "../constants/config"

export const getAccountBalance = async () => {
  const { walletAddress, provider } = getApplicationState().app
  const balance = await provider.getBalance(walletAddress);
  return ethers.formatUnits(BigInt(balance), 'ether')
}

export const attest = async () => {
  const { chain, provider, walletAddress  } = getApplicationState().app
  const { EAS_CONTRACT_ADDRESS, SCHEMA_ID } = CONTRACT_CONFIG[chain.eip155]

  const eas = new EAS(EAS_CONTRACT_ADDRESS)
  const signer = provider.getSigner()
  eas.connect(signer)

  const schemaEncoder = new SchemaEncoder('string testField')
  const encodedData = schemaEncoder.encodeData([
    { name: 'testField', value: 'this is the test', type: 'string' },
  ])

  const tx = await eas.attest({
    schema: SCHEMA_ID,
    data: {
      recipient: walletAddress,
      expirationTime: 0,
      revocable: true,
      data: encodedData
    }
  })

  const newAttestationUID = await tx.wait()

  console.log('New attestation UID:', newAttestationUID)
  console.log('Transaction receipt:', tx.receipt)
}

export const delegatedAttestationRequest = async () => {
  const { chain, provider, walletAddress  } = getApplicationState().app
  const { EAS_CONTRACT_ADDRESS, SCHEMA_ID } = CONTRACT_CONFIG[chain.eip155]


  const providerE = new ethers.BrowserProvider(window.ethereum)


  const walletSigner = await providerE.getSigner()

  const schemaEncoder = new SchemaEncoder('string testField')
  const encodedDataString = schemaEncoder.encodeData([
    { name: 'testField', value: 'this is the test', type: 'string' },
  ])

  const eas = new EAS(EAS_CONTRACT_ADDRESS)
  eas.connect(walletSigner)

  const delegated = await eas.getDelegated()
  if (provider && chain?.eip155) {
    try {
      const params = {
        schema: SCHEMA_ID,
        recipient: walletAddress,
        expirationTime: 0n,
        revocable: false,
        refUID: ZERO_BYTES32,
        data: encodedDataString,
        value: 0n,
        nonce: await eas.getNonce(walletAddress),
        deadline: 0n
      }
      const delegatedAttestation = await delegated.signDelegatedAttestation(
        params,
        walletSigner
      )

      const attestDelegatedParams = {
        schema: delegatedAttestation.message.schema,
        data: {
          recipient:delegatedAttestation.message.recipient,
          expirationTime: delegatedAttestation.message.expirationTime,// 0n,
          revocable: delegatedAttestation.message.revocable,
          refUID:  delegatedAttestation.message.revocable.refUID,
          data: delegatedAttestation.message.data,
        },
        signature: delegatedAttestation.signature,
        attester: walletAddress,
      }

      const tx = await eas.attestByDelegation(
        attestDelegatedParams
      )
      console.log('Transaction receipt:', tx)
    } catch (e) {
      console.error("Error:", e)
    }
  }
}
