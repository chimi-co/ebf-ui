import { EAS, SchemaEncoder, ZERO_BYTES32} from '@ethereum-attestation-service/eas-sdk';

import {getApplicationState} from "../utils"
import {CONTRACT_CONFIG} from "../constants/config"
import {addDelegateAttestationSign} from "./FirestoreSerivce"
import {toast} from "react-toastify"

export const delegatedAttestationRequest = async (ipfsHash, survey) => {
  const {surveyId, projectName, projectLocation, projectWebsite, shortProjectDescription} = survey
  const { chain, provider, walletAddress  } = getApplicationState().app
  const { EAS_CONTRACT_ADDRESS, SCHEMA_ID } = CONTRACT_CONFIG[chain.eip155]

  const walletSigner = await provider.getSigner()

  const questionsAndAnswers = [
    { name: 'IpfsUri', value: `ipfs://${ipfsHash}`, type: 'string' },
    { name: 'ProjectName', value: projectName, type: 'string' },
    { name: 'ProjectLocation', value: projectLocation, type: 'string' },
    { name: 'ProjectWebsite', value: projectWebsite, type: 'string' },
    { name: 'Description', value: shortProjectDescription, type: 'string' },
  ]

  const recipient = import.meta.env.VITE_API_RECIPIENT
  const schemaEncoder = new SchemaEncoder('string IpfsUri, string ProjectName, string ProjectLocation, string ProjectWebsite, string Description')
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
        ipfsHash,
        network: chain,
        attester: walletAddress,
        surveyId,
      }

      delete sign.expirationTime
      delete sign.nonce

      return await addDelegateAttestationSign(sign)
    } catch (e) {
      toast.error('Delegate attestation sign completed', {autoClose: 4000})
      throw e
    }
  }
}
