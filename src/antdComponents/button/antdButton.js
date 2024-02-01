import React from 'react'
import { Button } from 'antd'
import './button.css'

const AntdButton = ({ color, text, ...props }) => {
  const buttonType = `btn-${color || 'default'}`

  return (
    <Button className={buttonType} {...props}>
      {text}
    </Button>
  )
}

export default AntdButton
