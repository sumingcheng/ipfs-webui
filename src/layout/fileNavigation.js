import React, { useState } from 'react'
import { FileOutlined, DatabaseOutlined, FolderOpenOutlined, FileZipOutlined } from '@ant-design/icons'
import { Menu } from 'antd'

const items = [
  {
    label: '模型文件',
    key: 'model-file'
    // icon: <FileOutlined />
  },
  {
    label: '模型镜像文件',
    key: 'model-image-file'
    // icon: <DatabaseOutlined />
  },
  {
    label: '数据集文件',
    key: 'dataset-file'
    // icon: <FolderOpenOutlined />
  },
  {
    label: '所有文件',
    key: 'all-files'
    // icon: <FileZipOutlined />
  }
]

const App = () => {
  const [current, setCurrent] = useState('model-file')
  const onClick = (e) => {
    console.log('click ', e)
    setCurrent(e.key)
  }

  return <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items}/>
}

export default App
