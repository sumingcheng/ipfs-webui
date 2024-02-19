import { useState, useCallback } from 'react'
import { message } from 'antd'

const API_URL = 'http://172.40.253.155:9999'
const token = '33f5b809-496a-4f7c-bd6c-94024d10d414'

const usePostAppAdd = () => {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const postAppAdd = useCallback(async (appData) => {
    setIsLoading(true)
    try {
      const response = await fetch(`${API_URL}/app/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token
        },
        body: JSON.stringify(appData)
      })

      const result = await response.json()
      if (!response.ok) {
        throw new Error(result.msg || '请求响应失败')
      }

      setData(result)
      if (result.code === 200) {
        message.success(result.msg || '模型正在上传到IPFS集群，请不要关闭客户端') // 显示成功提示
      } else {
        message.error(result.msg || '操作失败') // 显示错误提示
      }
    } catch (err) {
      setError(err)
      message.error(err.message || '操作失败')
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    postAppAdd,
    data,
    error,
    isLoading
  }
}

export default usePostAppAdd
