import { EAS, SchemaEncoder, ZERO_BYTES32} from '@ethereum-attestation-service/eas-sdk';
import {BrowserProvider, ethers} from 'ethers'

import {getApplicationState} from "../utils"
import {CONTRACT_CONFIG} from "../constants/config"
import {addDelegateAttestationSign} from "./FirestoreSerivce.js";
import {toast} from "react-toastify";

const questionsAndAnswers = [
  { name: 'testField', value: 'this is the test', type: 'string' },
]

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
  const encodedData = schemaEncoder.encodeData(questionsAndAnswers)

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

  const walletSigner = await provider.getSigner()

  const recipient = '0xc3689E0F44672CEC04387d6437968f6ead9d3a09'
  const schemaEncoder = new SchemaEncoder('string testField')
  const encodedDataString = schemaEncoder.encodeData(questionsAndAnswers)

  const eas = new EAS(EAS_CONTRACT_ADDRESS)
  eas.connect(walletSigner)

  const delegated = await eas.getDelegated()
  if (provider && chain?.eip155) {
    try {
      const params = {
        schema: SCHEMA_ID,
        recipient,
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

      const sign = {
        ...delegatedAttestation.message,
        signature: delegatedAttestation.signature,
        status: 'PENDING',
        questionsAndAnswers,
        network: chain,
        attester: walletAddress
      }

      delete sign.expirationTime
      delete sign.nonce

      await addDelegateAttestationSign(sign)

      toast.success('Delegate attestation sign completed', {autoClose: 4000})
    } catch (e) {
      toast.error('Delegate attestation sign completed', {autoClose: 4000})
      console.error("Error signing the attestation:", e)
    }
  }
}
