import { useState, useCallback } from 'react'
import { message } from 'antd'

const API_URL = 'http://172.40.253.155:15000'
// const token = '33f5b809-496a-4f7c-bd6c-94024d10d414'

const useGetModelTypes = () => {
  const [data, setData] = useState([])
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const getModelTypes = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`${API_URL}/model/types`, {
        method: 'get'
      })

      const result = await response.json()
      if (!response.ok) {
        throw new Error(result.msg || '请求响应失败')
      }

      if (result.code === 200) {
        setData(result.data.types)
        // message.success(result.msg || '添加成功') // 显示成功提示
      } else {
        message.error(result.msg || '获取模型列表失败') // 显示错误提示
      }
    } catch (err) {
      setError(err)
      message.error(err.message || '获取模型列表失败')
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    getModelTypes,
    data,
    error,
    isLoading
  }
}

export default useGetModelTypes
