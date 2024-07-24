import {Steps} from 'antd'
import {useEffect, useState} from "react"
import {useParams} from "react-router-dom"

import {Step} from "../../components/Stepper/Step/Step"

import {getSurveyById, updateSurvey} from "../../services/FirestoreSerivce"
import {STEPS} from "../../constants/app"

export default () => {
  const [current, setCurrent] = useState(0)
  const [steps, setSteps] = useState(STEPS)
  const { surveyId } = useParams()

  useEffect(() => {
    const fetchData = async () => {
      const survey = await getSurveyById(surveyId)
      setSteps(survey.steps)
    }

    if(surveyId) {
      fetchData()
    }
  }, [])

  const items = STEPS.map((item) => ({
    key: item.title,
    title: item.title,
  }))

  const handleSaveData = async (newQuestions) => {
    const copy = steps
    copy[current].questions = newQuestions
    setSteps(copy)
    await updateSurvey(surveyId, {steps: copy})
  }

  const handleChange = (value) => setCurrent(value)

  const handleNext = async (newQuestions) => {
    await handleSaveData(newQuestions)
    setCurrent(current + 1)
  }

  const handlePrevious = async (newQuestions) => {
    await handleSaveData(newQuestions)
    setCurrent(current - 1)
  }

  return (
    <div className="h-full">
      <div className="flex h-full">
        <Steps
          className="w-1/4"
          direction="vertical"
          current={current}
          items={items}
          progressDot
          size="small"
          onChange={handleChange}
        />
        <Step
          current={current}
          description={steps[current].description}
          questions={steps[current].questions}
          title={steps[current].title}
          steps={steps}
          onPrevious={handlePrevious}
          onNext={handleNext}
        />
      </div>
    </div>
  )
}