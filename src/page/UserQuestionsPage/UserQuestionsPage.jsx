import moment from 'moment'
import {Button, List, Spin, Tag} from 'antd'
import {useEffect, useState} from 'react'
import {Link, useNavigate, useParams} from 'react-router-dom'

import {addSurvey, getSurveysByUser} from '../../services/FirestoreSerivce'

import {STEPS} from '../../constants/app'

const status = { COMPLETED: {label:'Completed', color: 'success'}, PENDING: {label:'Pending', color: 'volcano'}}

export default () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
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
    navigate(`/users/${walletAddress}/surveys/${surveyId}`)

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
            <List.Item actions={[<Button>Attest</Button>]}>
              <List.Item.Meta
                title={<Link to={`/users/${walletAddress}/surveys/${item.id}`}>{item.id}</Link>}
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
