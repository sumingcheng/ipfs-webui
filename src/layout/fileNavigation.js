import React, { useState } from 'react'
import { Menu, Button } from 'antd'
import { FileTextOutlined, HddOutlined, DatabaseOutlined, FolderOutlined } from '@ant-design/icons'
import './layout.css'

const ModelFile = () => {
  return (
    <div className={'ModelFile'}>
      <Button shape="round">全部</Button>
      <Button shape="round">来自 HuggingFace</Button>
      <Button shape="round">来自 魔搭社区</Button>
    </div>
  )
}
const ModelImageFile = () => <div>正在开发中……</div>
const DatasetFile = () => <div>正在开发中……</div>
const AllFiles = () => <div>正在开发中……</div>

const App = () => {
  const [current, setCurrent] = useState('model-file')

  const onClick = (e) => {
    setCurrent(e.key)
  }

  // 定义菜单项
  const menuItems = [
    {
      label: '模型文件',
      key: 'model-file'
      // icon: <FileTextOutlined/>
    },
    {
      label: '模型镜像文件',
      key: 'model-image-file'
      // icon: <HddOutlined/>
    },
    {
      label: '数据集文件',
      key: 'dataset-file'
      // icon: <DatabaseOutlined/>
    },
    {
      label: '所有文件',
      key: 'all-files'
      // icon: <FolderOutlined/>
    }
  ]

  const renderContent = (key) => {
    switch (key) {
      case 'model-file':
        return <ModelFile/>
      case 'model-image-file':
        return <ModelImageFile/>
      case 'dataset-file':
        return <DatasetFile/>
      case 'all-files':
        return <AllFiles/>
      default:
        return null
    }
  }

  return (
    <div className="fileNavMain">
      <Menu className={'antdMenu'} onClick={onClick} selectedKeys={[current]} mode="horizontal" items={menuItems}/>
      <div className="content">
        {renderContent(current)}
      </div>
    </div>
  )
}

export default App
