import React from 'react'
import { Button, Dropdown } from 'antd'
import './index.css'
import '../../css/less/antd.css'

const items = [
  {
    key: '1',
    label: (
      <a className={'linkButton'} target="_blank" rel="noopener noreferrer" href="http://172.40.253.155:10001/">
        后台管理
      </a>
    )
  }
]

const App = () => {
  return (
    <div className={'menuButtons'}>
      <Button
        type="primary" className={'myButton doneButton'}
        onClick={() => window.open('http://172.40.253.155:10001/#/mybox/downloaded', '_blank')}
      >我的Box</Button>
      <Dropdown
        menu={{
          items
        }}
        placement="bottomLeft"
        arrow
      >
        <Button className={'settingButton normalButton'}>•••</Button>
      </Dropdown>
    </div>
  )
}

export default App
