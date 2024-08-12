import {Button, message} from "antd";

export default ({current, steps, onClick, isLoading}) => (
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
