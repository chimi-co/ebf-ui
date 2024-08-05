import {Button, Checkbox, Form, Input, message, Radio} from "antd";
import {useEffect, useState} from "react";
import Markdown from 'markdown-to-jsx'

import './styles.css'

export const Step = ({backgroundColor, current, questions, steps, title, description, subtitle, onNext, onPrevious}) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
   questions.forEach((q, index) =>{
     form.setFieldValue(index,  q.answer)
   })
  }, [questions])

  const handleSubmit = (dir) => {
    setLoading(true)
    const values = form.getFieldsValue()

    const newquestions = questions.map((question, index) => {
      return {...question, answer: values[index],}
    })

    if(dir === 'previous') {
      onPrevious(newquestions)
    } else {
      onNext(newquestions)
    }
    setLoading(false)
  }

  return(
    <div className="w-3/4">
      <div className="flex h-full">
        <div className="w-1/2 py-3 px-6" style={{backgroundColor: backgroundColor}}>
          <div className="text-center my-4">
            <h2 className="text-white">{title}</h2>
          </div>
          <Markdown className="description text-white text-sm">
            {description ?? ''}
          </Markdown>
        </div>
        <div className="content w-1/2 p-3 px-6 ml-4 overflow-auto	">
          <h4 className="pb-6">{<Markdown>{subtitle}</Markdown>}</h4>
          <Form
            name="create-step-form"
            form={form}
            layout="vertical"
          >
            {questions?.map((question, index) => {
              const newOptions = (question.options || ['Yes', 'No']).map(option=> ({label: option, value: option}))
              return (
                <Form.Item
                  key={question.label}
                  label={<Markdown>{question.label}</Markdown>}
                  required={question.required}
                  name={index}
                >
                  <CustomInput type={question.type} options={newOptions}/>
                </Form.Item>
              )

            }
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

const CustomInput = ({ type, ...rest }) => {
  switch (type) {
    case 'textArea':
      return <Input.TextArea {...rest} />;
    case 'checkbox':
      return (
        <Checkbox.Group options={rest.options} {...rest}/>
      )
    case 'radio':
      return (
        <Radio.Group options={rest.options} {...rest}/>
      );
    default:
      return <Input {...rest} />;
  }
}

const StepperNavigation = ({current, steps, onClick, isLoading}) => (
  <div className="flex justify-end">
    {current > 0 && (
      <Button loading={isLoading} className="my-0 mx-2" onClick={() => onClick('previous')}>
        PREVIOUS
      </Button>
    )}
    {current < steps - 1 && (
      <Button loading={isLoading}  type="primary" onClick={() => onClick('next')}>
        NEXT
      </Button>
    )}
    {current === steps - 1 && (
      <Button type="primary" onClick={() => message.success('Processing complete!')}>
        Done
      </Button>
    )}
  </div>
)