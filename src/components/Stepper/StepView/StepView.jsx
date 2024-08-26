import Markdown from "markdown-to-jsx";
import StepperNavigation from "../StepperNavigation/StepperNavigation";
import {Descriptions} from "antd";

export default ({backgroundColor, current, questions, steps, title, description, subtitle, onDone, onNext, onPrevious}) => {

  const handleClick = (dir) => {
    if(dir === 'previous') {
      onPrevious()
    }

    if(dir === 'next') {
      onNext()
    }

    if(dir === 'done') {
      onDone()
    }
  }

  return (
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
          {questions?.map((question) => (
            <Descriptions key={question.label} layout="vertical">
              <Descriptions.Item label={<Markdown>{question.label}</Markdown>}>
                <DisplayAnswer answer={question.answer}/>
              </Descriptions.Item>
            </Descriptions>
          ))}
        </div>
      </div>
      <StepperNavigation
        current={current}
        steps={steps.length}
        onClick={handleClick}
      />
    </div>
  )
}

const DisplayAnswer = ({ answer }) => {
  const formattedAnswer = Array.isArray(answer)
    ? answer.join(', ')
    : answer

  return <div>{formattedAnswer}</div>
}
