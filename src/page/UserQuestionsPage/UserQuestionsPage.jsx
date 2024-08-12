import moment from 'moment'
import {Button, List, Spin, Tag} from 'antd'
import {useEffect, useState} from 'react'
import {Link, useNavigate, useParams} from 'react-router-dom'

import {addSurvey, getSurveysByUser, updateSurvey} from '../../services/FirestoreSerivce'
import {delegatedAttestationRequest} from "../../services/BlockchainService"

import {STEPS} from '../../constants/app'

import './styles.css'

const status = {
  COMPLETED: {label:'Completed', color: 'success'},
  PENDING: {label:'Pending', color: 'volcano'},
  SIGNED: {label:'Submitted', color: 'processing'},
}

export default () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingBtn, setLoadingBtn] = useState({})
  const [loadingAdd, setLoadingAdd] = useState(false)
  const { userWallet: walletAddress } = useParams()
  const navigate = useNavigate()

  const fetchSurveys = async () => {
    setLoading(true)
    const surveys = await getSurveysByUser(walletAddress)
    setData(surveys)
    setLoading(false)
  }

  useEffect(() => {
    const fetchData = async () => {
      await fetchSurveys()
    }
    if(!data.length) {
      fetchData()
    }
  }, [])

  const handleAddSurvey = async () => {
    setLoadingAdd(true)
    const surveyId = await addSurvey({steps: STEPS, walletAddress, createdAt: Date.now(), status: 'PENDING'})
    setLoadingAdd(false)
    handleGoToEditSurvey(surveyId)
  }

  const handleGoToEditSurvey = (id) => {
    navigate(`/users/${walletAddress}/surveys/${id}/edit`)
  }

  const handleGoToSurvey = (id) => {
    navigate(`/users/${walletAddress}/surveys/${id}`)
  }

  const handleDelegatedAttestation = async (surveyId) => {
    setLoadingBtn((prevState) => ({ ...prevState, [surveyId]: true }))
    try {
      const hash = 'Hash from ipfs'
      const delegatedAttestationId = await delegatedAttestationRequest(hash, surveyId)
      await updateSurvey(surveyId, {status: 'SIGNED', delegatedAttestationId})
      await fetchSurveys()
    } catch (error) {
      console.error('Error when sign the attestation', error)
    }
    setLoadingBtn((prevState) => ({ ...prevState, [surveyId]: false }))
  }

  return (
    <div className="max-w-3xl my-0 mx-auto">
      <div className="flex justify-between">
        <div>
          <h1>Surveys</h1>
        </div>
        <div>
          <Button disabled={loadingAdd} type="primary" onClick={handleAddSurvey}>Start a new survey</Button>
        </div>
      </div>
      <Spin spinning={loading}>
        <List
          itemLayout="horizontal"
          dataSource={data}
          renderItem={(item) => (
            <List.Item actions={ item.status === 'PENDING' ?
              [
                <Button onClick={() => handleGoToEditSurvey(item.id)}>Edit</Button>,
                <Button disabled={!item.isValid} loading={loadingBtn[item.id]} onClick={() => handleDelegatedAttestation(item.id)}>Submit</Button>] :
              [
                <Button onClick={() => handleGoToSurvey(item.id)}>View</Button>,
              ]
            }>
              <List.Item.Meta
                title={<Link to={`/users/${walletAddress}/surveys/${item.id}/edit`}>{item.id}</Link>}
                description={`Survey created at: ${moment(item.createdAt).format('LL')}`}
              />
              <div className="flex">
                <div className="flex items-center">
                  <Tag color={status[item.status].color}>{status[item.status].label}</Tag>
                </div>
              </div>
            </List.Item>
          )}
        />
      </Spin>
    </div>
  )
}
