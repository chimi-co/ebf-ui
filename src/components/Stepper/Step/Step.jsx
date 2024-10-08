import {Checkbox, Form, Input, Radio} from "antd"
import {forwardRef, useEffect, useImperativeHandle, useState} from "react"
import Markdown from 'markdown-to-jsx'

import StepperNavigation from "../StepperNavigation/StepperNavigation"

import './styles.css'

export const Step = forwardRef(({backgroundColor, current, intro, questions, steps, title, description, subtitle, onDone, onNext, onPrevious, onSave}, ref) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
   questions.forEach((q, index) =>{
     form.setFieldValue(index,  q.answer)
   })
  }, [questions])

  const handleSubmit = (dir = '') => {
    setLoading(true)
    const values = form.getFieldsValue()

    const newquestions = questions.map((question, index) => {
      return {...question, answer: values[index],}
    })

    if(dir === 'previous') {
      onPrevious(newquestions)
    } else if (dir === 'next') {
      onNext(newquestions)
    } else if (dir === 'done') {
      onDone(newquestions)
    } else {
      onSave(newquestions)
    }

    setLoading(false)
  }

  useImperativeHandle(ref, () => ({
    handleSubmit
  }))

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
        {intro ? <div className="intro content w-1/2 p-3"/> :
          <div className="content w-1/2 p-3 px-6 ml-4 overflow-auto">
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
              })}
            </Form>
          </div>
        }

      </div>
      <StepperNavigation
        current={current}
        isLoading={loading}
        steps={steps.length}
        onClick={handleSubmit}
      />
    </div>
  )
})

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
