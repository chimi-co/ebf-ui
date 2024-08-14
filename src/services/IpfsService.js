import {client} from '../axios'

export const getIpfsHash = async (surveyId) => {
  try {
    return await client.get(`/ipfs/${surveyId}`, )
  } catch (error) {
    console.error(error)
    throw error
  }
}