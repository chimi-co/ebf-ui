import {db} from '../firebase';
import {addDoc, collection} from 'firebase/firestore'

const DELEGATE_ATTESTATION_SIGNS_COLLECTION = 'DelegateAttestationSigns'

async function addDocument(collectionName, data) {
  try {
    return await addDoc(collection(db, collectionName), data)
  } catch (e) {
    throw e
  }
}

export const addDelegateAttestationSign = async (data) => {
  try {
    const docRef = await addDocument(DELEGATE_ATTESTATION_SIGNS_COLLECTION, data)
    console.log("Documento añadido con ID: ", docRef.id)
  } catch (e) {
    console.error("Error añadiendo documento: ", e)
  }
}