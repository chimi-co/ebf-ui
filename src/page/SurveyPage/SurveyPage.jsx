import {ArrowLeftOutlined} from "@ant-design/icons"
import {Button, Spin, Steps} from "antd"
import {useEffect, useState} from "react"
import {useNavigate, useParams} from "react-router-dom"

import {getSurveyById} from "../../services/FirestoreSerivce"

import {STEPS} from "../../constants/app"
import StepView from "../../components/Stepper/StepView/StepView";

export default () => {
  const [isLoading, setIsLoading] = useState(false)
  const [current, setCurrent] = useState(0)
  const [steps, setSteps] = useState(STEPS)

  const navigate = useNavigate()

  const { surveyId, userWallet: walletAddress  } = useParams()

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      const survey = await getSurveyById(surveyId)
      setSteps(survey.steps)
      setIsLoading(false)
    }

    if(surveyId) {
      fetchData()
    }
  }, [])

  const handleReturnPage = () => navigate(`/users/${walletAddress}/surveys`)

  const items = steps.map((item, index) => {
    return ({
      key: item.title,
      title: item.title,
    })
  })

  const handleChange = (value) => setCurrent(value)

  return (
    <Spin spinning={isLoading}>
      <div style={{ height: 'calc(100vh - 200px)' }}>
        <div className="flex h-full">
          <div className="back-container">
            <Button icon={<ArrowLeftOutlined />} onClick={handleReturnPage}/>
          </div>
          <Steps
            className="steps-container"
            style={{overflow: 'auto'}}
            direction="vertical"
            current={current}
            items={items}
            onChange={handleChange}
          />
          <StepView
            backgroundColor={steps[current]?.backgroundColor}
            current={current}
            description={steps[current]?.description}
            questions={steps[current]?.questions}
            subtitle={steps[current]?.subtitle}
            steps={steps}
            title={steps[current]?.title}
            onDone={handleReturnPage}
            onPrevious={() => setCurrent(current - 1)}
            onNext={() => setCurrent(current + 1)}
          />
        </div>
      </div>
    </Spin>
  )
}