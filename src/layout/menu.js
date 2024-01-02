import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { Menu } from 'antd'
import Main from './main.js'

const App = () => {
  const [current, setCurrent] = useState('index')

  const onClick = (e) => {
    console.log('click ', e)
    setCurrent(e.key)
  }

  return (
    <Router>
      <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal">
        <Menu.Item key="index">
          <Link to="/">首页</Link>
        </Menu.Item>
        <Menu.Item key="modelRepository">
          <Link to="/modelRepository">模型仓库</Link>
        </Menu.Item>
      </Menu>
      <Routes>
        <Route path="/modelRepository" element={<ModelRepository />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  )
}

// 这里定义你的 ModelRepository 组件
const ModelRepository = () => {
  return <div><Main/></div>
}

// 这里定义你的 Home 组件
const Home = () => {
  return <div>首页内容</div>
}

export default App
