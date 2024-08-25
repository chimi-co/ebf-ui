import {ArrowLeftOutlined} from "@ant-design/icons"
import {Button, Spin, Steps} from 'antd'
import {useEffect, useState} from "react"
import {useNavigate, useParams} from "react-router-dom"

import {Step} from "../../components/Stepper/Step/Step"

import {getSurveyById, updateSurvey} from "../../services/FirestoreSerivce"
import {STEPS} from "../../constants/app"

import './styles.css'

const tutorial = {
  title: `Intro`,
  description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
  backgroundColor: 'black',
  subtitle: `Lorem Ipsum is simply dummy text of the printing and typesetting industry.`,
  questions: []
}

export default () => {
  const [current, setCurrent] = useState(0)
  const [steps, setSteps] = useState(STEPS)
  const [isLoading, setIsLoading] = useState(false)
  const [stepStatuses, setStepStatuses] = useState(new Array(STEPS.length + 1).fill(''))

  const { userWallet: walletAddress , surveyId } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      const survey = await getSurveyById(surveyId)
      await setSteps([tutorial, ...survey.steps])
      await validateSurvey([tutorial, ...survey.steps])
      setIsLoading(false)
    }

    if(surveyId) {
      fetchData()
    }
  }, [])

  const items = steps.map((item, index) => {
    return ({
      key: item.title,
      title: item.title,
      status: current === index ? null : stepStatuses[index]
    })
  })

  const handleSaveData = async (newQuestions) => {
    setIsLoading(true)
    const copy = steps
    copy[current].questions = newQuestions
    setSteps(copy)
    await validateSurvey(copy)
    if(current === 1) {
      await updateSurvey(surveyId, {
        projectName: newQuestions[0]?.answer,
        projectLocation: newQuestions[1]?.answer,
        projectWebsite: newQuestions[2]?.answer,
        shortProjectDescription: newQuestions[3].answer,
        steps: copy.slice(1)
      })
    } else {
      await updateSurvey(surveyId, {steps: copy.slice(1)})
    }
    setIsLoading(false)
  }

  const validateSurvey = async (copy) => {
    copy.forEach((step, index) => {
     const error = validateQuestions(step.questions)
      let status
      if(error) {
        status = 'waiting'
      } else {
        status = 'finish'
      }
      stepStatuses[index] = status
    })

    const isValid = stepStatuses.every(status => status === 'finish')
    await updateSurvey(surveyId, {isValid})
    console.log(stepStatuses, isValid)
  }

  const validateQuestions = (questions) => questions.some(q => q.required && q.answer === '')

  const handleChange = (value) => {
    setCurrent(value)
  }

  const handleNext = async (newQuestions) => {
    await handleSaveData(newQuestions)
    if(current < steps.length - 1) {
      setCurrent(current + 1)
    }
  }

  const handlePrevious = async (newQuestions) => {
    await handleSaveData(newQuestions)
    setCurrent(current - 1)
  }

  const handleReturnPage = () => {
    navigate(`/users/${walletAddress}/surveys`)
  }

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
          <Step
            backgroundColor={steps[current]?.backgroundColor}
            current={current}
            description={steps[current]?.description}
            questions={steps[current]?.questions}
            subtitle={steps[current]?.subtitle}
            steps={steps}
            title={steps[current]?.title}
            onPrevious={handlePrevious}
            onNext={handleNext}
          />
        </div>
      </div>
    </Spin>
  )
}