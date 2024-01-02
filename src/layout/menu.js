import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Main from './main.js'
import MenuRight from './components/menuRight.js'
import { Col, Row, Menu } from 'antd'

// Style
import './layout.css'

const App = () => {
  const [current, setCurrent] = useState('index')

  const onClick = (e) => {
    console.log('click ', e)
    setCurrent(e.key)
  }

  // 定义菜单项
  const menuItems = [
    {
      label: <Link to="/">首页</Link>,
      key: 'index'
    },
    {
      label: <Link to="/modelRepository">模型仓库</Link>,
      key: 'modelRepository'
    }
  ]

  return (
    <Router>
      <Row className={'menuRow'}>
        <Col span={8}>
          <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" className={'main'}
                items={menuItems}/>
        </Col>
        <Col span={8}></Col>
        <Col span={8}>
          <MenuRight/>
        </Col>
      </Row>
      <Routes>
        <Route path="/modelRepository" element={<ModelRepository/>}/>
        <Route path="/" element={<Home/>}/>
      </Routes>
    </Router>
  )
}

// 这里定义你的 ModelRepository 组件
const ModelRepository = () => {
  return (
    <div>
      <Main/>
    </div>
  )
}

// 这里定义你的 Home 组件
const Home = () => {
  return (<div>正在开发中……</div>)
}

export default App
