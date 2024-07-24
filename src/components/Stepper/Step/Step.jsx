import {Button, Form, Input, message} from "antd";
import {useEffect, useState} from "react";

export const Step = ({current, questions, steps, title, description, onNext, onPrevious}) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
   questions.forEach((q, index) =>{
     form.setFieldValue(index,  q.answer)
   })
  }, [questions])

  const section = {
    subtitle:`Put answers inside boxes below. Use the box at left if additional space is required.`,
  }

  const handleSubmit = (dir) => {
    setLoading(true)
    const values = form.getFieldsValue()

    const newquestions = questions.map((question, index) => {
      return {label: question.label, answer: values[index]}
    })

    if(dir === 'previous') {
      onPrevious(newquestions)
    } else {
      onNext(newquestions)
    }
    setLoading(false)
  }

  return(
    <div className="h-full w-3/4">
      <div className="flex" style={{ height: 'calc(100% - 100px)' }}>
        <div className="w-1/2 py-3 px-6" style={{backgroundColor: '#083763'}}>
          <div className="text-center my-4">
            <h2 className="text-white">{title}</h2>
          </div>
          <p className="text-white text-sm">{description ?? ''}</p>
        </div>
        <div className="w-1/2 p-3 px-6 ml-4">
          <h4 className="pb-6">{section.subtitle}</h4>
          <Form
            name="create-step-form"
            form={form}
            layout="vertical"
          >
            {questions?.map((question, index) =>
              <Form.Item
                key={question.label}
                label={question.label}
                required
                name={index}
              >
                <Input />
              </Form.Item>
            )}
          </Form>
        </div>
      </div>
      <StepperNavigation
        current={current}
        isLoading={loading}
        steps={steps.length}
        onClick={handleSubmit}
      />
    </div>
  )
}

const StepperNavigation = ({current, steps, onClick, isLoading}) => (
  <div className="flex justify-end mt-4">
    {current > 0 && (
      <Button loading={isLoading} className="my-0 mx-2" onClick={() => onClick('previous')}>
        Previous
      </Button>
    )}
    {current < steps - 1 && (
      <Button loading={isLoading}  type="primary" onClick={() => onClick('next')}>
        Next
      </Button>
    )}
    {current === steps - 1 && (
      <Button type="primary" onClick={() => message.success('Processing complete!')}>
        Done
      </Button>
    )}
  </div>
)