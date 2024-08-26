import {ArrowLeftOutlined} from "@ant-design/icons"
import {Button, Spin, Steps} from 'antd'
import {useEffect, useRef, useState} from "react"
import {useNavigate, useParams} from "react-router-dom"

import {Step} from "../../components/Stepper/Step/Step"

import {getSurveyById, updateSurvey} from "../../services/FirestoreSerivce"
import {STEPS} from "../../constants/app"

import './styles.css'

const tutorial = {
  title: `Intro`,
  description: 'To understand the full range of positive impacts associated with an EBF project, we start with the people behind the project and the communities that benefit from their work. \n' +
    '\n' +
    'By asking the right questions we can learn not only about the problems their project seeks to solve, but also how they intend to achieve their project’s stated outcomes. \n' +
    '\n' +
    'This onboarding will also help to unlock “unanticipated” benefits their project may offer, from providing jobs, reducing poverty, or even access to vital services like education. Improvements in air and water quality, for example, can contribute to a healthier environment, leading to improved overall health for the community.\n' +
    '\n' +
    'Additionally, by addressing equity and social empowerment, marginalized groups like women, Indigenous communities, and vulnerable populations can also be positively impacted by projects that have identified the right objectives for their work. When everyone is involved and empowered, regardless of their background, the positive impacts of any EBF project become even more meaningful.',
  intro: true,
  backgroundColor: 'black',
  subtitle: '',
  questions: []
}

export default () => {
  const [current, setCurrent] = useState(0)
  const [steps, setSteps] = useState(STEPS)
  const [isLoading, setIsLoading] = useState(false)
  const [stepStatuses, setStepStatuses] = useState(new Array(STEPS.length + 1).fill(''))

  const stepRef = useRef(null)

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
  }

  const validateQuestions = (questions) => questions.some(q => q.required && q.answer === '')

  const handleChange = (value) => {
    console.log(stepRef)
    if (stepRef.current) {
      stepRef.current.handleSubmit()
    }
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

  const handleDone = async (newQuestions) => {
    await handleSaveData(newQuestions)
    handleReturnPage()
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
            ref={stepRef}
            backgroundColor={steps[current]?.backgroundColor}
            current={current}
            intro={steps[current]?.intro}
            description={steps[current]?.description}
            questions={steps[current]?.questions}
            subtitle={steps[current]?.subtitle}
            steps={steps}
            title={steps[current]?.title}
            onSave={handleSaveData}
            onDone={handleDone}
            onPrevious={handlePrevious}
            onNext={handleNext}
          />
        </div>
      </div>
    </Spin>
  )
}