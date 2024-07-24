import {db} from '../firebase';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  updateDoc,
  where,
  getDocs,
  query,
  orderBy
} from 'firebase/firestore'

const DELEGATE_ATTESTATION_SIGNS_COLLECTION = 'DelegateAttestationSigns'
const SURVEYS_COLLECTION = 'surveys'


async function getDocuments(collectionName, conditions = []) {
  try {
    const colRef = collection(db, collectionName)
    const queryConstraints = conditions.map((condition) => where(...condition))

    queryConstraints.push(orderBy('createdAt', 'desc'))

    const q = query(colRef, ...queryConstraints)
    const querySnapshot = await getDocs(q)

    const documents = []
    querySnapshot.forEach((doc) => {
      documents.push({ id: doc.id, ...doc.data() })
    });

    return documents
  } catch (error) {
    console.error('Error getting documents: ', error)
  }
}

async function addDocument(collectionName, data) {
  try {
    return await addDoc(collection(db, collectionName), data)
  } catch (e) {
    throw e
  }
}

async function updateDocument(collectionName, documentId, updatedData) {
  try {
    const docRef = doc(db, collectionName, documentId);

    await updateDoc(docRef, updatedData);

    console.log('Document successfully updated');
  } catch (error) {
    console.error('Error updating document:', error);
  }
}

export const addSurvey = async (data) => {
  try {
    const docRef = await addDocument(SURVEYS_COLLECTION, data)
    return docRef.id
  } catch (error) {
    console.error("Error adding survey: ", error)
  }
}

export const getSurveysByUser = async (walletAddress) => {
  try {
    const conditions = [
      ['walletAddress', '==', walletAddress]
    ]
    return await getDocuments(SURVEYS_COLLECTION, conditions)
  } catch (error) {
    console.error('Error getting pending signatures', error)
  }
}

export const updateSurvey = async (id, values) => {
  try {
    await updateDocument(SURVEYS_COLLECTION, id, values)
  } catch (error) {
    console.error("Error adding survey: ", error)
  }
}

export const getSurveyById = async (id) => {
  try {
    const attestationDelegatedRef = doc(db, SURVEYS_COLLECTION, id)
    const docSnap =  await getDoc(attestationDelegatedRef)
    return {id: docSnap.id, ...docSnap.data()}
  } catch (error) {
    console.error('Error obteniendo el documento: ', error)
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