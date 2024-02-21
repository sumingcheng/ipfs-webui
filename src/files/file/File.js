import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import { join, basename } from 'path'
import { withTranslation } from 'react-i18next'
import classnames from 'classnames'
import { normalizeFiles, humanSize, sizeToBytes } from '../../lib/files.js'
// React DnD
import { useDrag, useDrop } from 'react-dnd'
// Components
import GlyphDots from '../../icons/GlyphDots.js'
import Tooltip from '../../components/tooltip/Tooltip.js'
import Checkbox from '../../components/checkbox/Checkbox.js'
import FileIcon from '../file-icon/FileIcon.js'
import { CID } from 'multiformats/cid'
import { NativeTypes } from 'react-dnd-html5-backend'
import PinIcon from '../pin-icon/PinIcon.js'
import { Modal, Form, Input, Button, Select, message } from 'antd'
import usePostAppAdd from '../../hooks/addModel.js'
import '../../css/style.css'
import useGetModelTypes from '../../hooks/getModelTypes.js'

import './file.css'

const { Option } = Select
const File = ({
  name,
  type,
  size,
  cid,
  path,
  pinned,
  t,
  selected,
  focused,
  translucent,
  coloured,
  cantSelect,
  cantDrag,
  isMfs,
  isRemotePin,
  isPendingPin,
  isFailedPin,
  onAddFiles,
  onMove,
  onSelect,
  onNavigate,
  onSetPinning,
  onDismissFailedPin,
  handleContextMenuClick
}) => {
  const dotsWrapper = useRef()

  const handleCtxLeftClick = (ev) => {
    const pos = dotsWrapper.current.getBoundingClientRect()
    handleContextMenuClick(ev, 'LEFT', {
      name,
      size,
      type,
      cid,
      path,
      pinned
    }, pos)
  }

  const handleCtxRightClick = (ev) => {
    handleContextMenuClick(ev, 'RIGHT', {
      name,
      size,
      type,
      cid,
      path,
      pinned
    })
  }

  const [, drag, preview] = useDrag({
    item: {
      name,
      size,
      cid,
      path,
      pinned,
      type: 'FILE'
    },
    canDrag: !cantDrag && isMfs
  })

  const checkIfDir = (monitor) => {
    if (!isMfs) return false
    const item = monitor.getItem()
    if (!item) return false

    if (item.name) {
      return type === 'directory' &&
        name !== item.name &&
        !selected
    }

    return type === 'directory'
  }

  const [{
    isOver,
    canDrop
  }, drop] = useDrop({
    accept: [NativeTypes.FILE, 'FILE'],
    drop: (_, monitor) => {
      const item = monitor.getItem()

      if (item.files) {
        (async () => {
          const files = await item.filesPromise
          onAddFiles(normalizeFiles(files), path)
        })()
      } else {
        const src = item.path
        const dst = join(path, basename(item.path))

        onMove(src, dst)
      }
    },
    canDrop: (_, monitor) => checkIfDir(monitor),
    collect: (monitor) => ({
      canDrop: checkIfDir(monitor),
      isOver: monitor.isOver()
    })
  })

  let className = 'File b--light-gray relative flex items-center bt'

  if (selected) {
    className += ' selected'
  }

  const styles = {
    height: 55,
    overflow: 'visible'
  }

  if (focused || (selected && !translucent) || coloured || (isOver && canDrop)) {
    styles.backgroundColor = '#f5f6fe'
  } else if (translucent) {
    className += ' o-70'
  }

  if (focused) {
    styles.border = '1px dashed #9ad4db'
  } else {
    styles.border = '1px solid transparent'
    styles.borderTop = '1px solid #eee'
  }

  size = humanSize(size, { round: 0 })
  const hash = cid.toString() || t('hashUnavailable')

  const select = (select) => onSelect(name, select)

  const checkBoxCls = classnames({
    'o-70 glow': !cantSelect,
    'o-1': selected || focused
  }, ['pl2 w2'])
  /* 调色盘 */
  // const [color, setColor] = React.useState('')
  // const [showPicker, setShowPicker] = React.useState(false)
  const {
    getModelTypes,
    data,
    error,
    isLoading
  } = useGetModelTypes()

  const handleColorChange = (value) => {
    // setColor(color.hex)
    form.setFieldsValue({ logo: value })
    // setShowPicker(false)
  }

  const handleType = (value) => {
    if (value === 'other') {
      message.warning('上传非标准模型可能会导致应用无法正常对话')
    }
    form.setFieldsValue({ modelType: value })
  }

  /* 弹窗逻辑 */
  const [isModalVisible, setIsModalVisible] = React.useState(false)
  const [confirmLoading, setConfirmLoading] = React.useState(false)
  const [modelList, setModelList] = React.useState([])

  React.useEffect(() => {
    getModelTypes()
  }, [])

  const [form] = Form.useForm()
  const { postAppAdd } = usePostAppAdd()
  /* 展示弹窗 */
  const showModal = async (appIpfsHash, appName, size) => {
    form.setFieldsValue({
      appIpfsHash: appIpfsHash.toString(),
      appName,
      fileSize: sizeToBytes(size)
    })
    setIsModalVisible(true)
  }
  /* 下载 */
  const handleDownload = () => {
    console.log('下载', cid)
  }

  const handleOk = async () => {
    try {
      setConfirmLoading(true)
      const values = await form.validateFields()
      console.log('提交信息', values)
      // 广播模型
      await postAppAdd(values)
      setConfirmLoading(false)
      setIsModalVisible(false)
    } catch (errorInfo) {
      console.log('Failed:', errorInfo)
    }
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  return (
    <div ref={drop}>
      <div className={className} style={styles} onContextMenu={handleCtxRightClick} ref={drag}>
        <div className={checkBoxCls}>
          <Checkbox disabled={cantSelect} checked={selected} onChange={select}
                    aria-label={t('checkboxLabel', { name })}/>
        </div>
        {/* 模型名称 */}
        <button ref={preview} onClick={onNavigate}
                className="relative pointer flex items-center flex-grow-1 ph2 pv1 w-30"
                aria-label={name === '..'
                  ? t('previousFolder')
                  : t('fileLabel', {
                    name,
                    type,
                    size
                  })}>
          <div className="dib flex-shrink-0 mr2">
            <FileIcon name={name} type={type}/>
          </div>
          <div style={{ width: 'calc(100% - 3.25rem)' }}>
            <Tooltip text={name}>
              <div className="f6 truncate charcoal">{name}</div>
            </Tooltip>
            <Tooltip text={hash}>
              <div className="f7 mt-1 gray truncate monospace">{hash}</div>
            </Tooltip>
          </div>
        </button>
        {/* 固定状态 */}
        <div className="ph2 pv1 flex-none dn db-l tr mw3 w-20 transition-all">
          <button className="ph2 db button-inside-focus PinState" style={{
            width: '2.5rem',
            height: '2rem'
          }} onClick={isFailedPin
            ? onDismissFailedPin
            : () => onSetPinning([{
                cid,
                pinned
              }])}>
            <PinIcon isFailedPin={isFailedPin} isPendingPin={isPendingPin} isRemotePin={isRemotePin} pinned={pinned}/>
          </button>
        </div>
        {/* 大小 */}
        <div className="tableTextColor size pl2 pr4 pv1 flex-none f6 dn db-l tr w-10 mw4">
          {size}
        </div>
        {/* 操作 */}
        <div className="size pl2 pr4 pv1 rowTable f6 dn db-l tc w-20 mw4">
          <Button type="text" onClick={handleDownload} className={'tableTextColor'}>下载</Button>
          <Button type="text" onClick={() => showModal(cid, name, size)} className={'tableTextColor'}>广播</Button>
          <Button type="text" onClick={() => showModal(cid, name, size)} className={'tableTextColor'}>更多</Button>
        </div>
        {/* ... */}
        <button ref={dotsWrapper} className="ph2 db button-inside-focus file-context-menu" style={{ width: '2.5rem' }}
                onClick={handleCtxLeftClick} aria-label={t('checkboxLabel', { name })}>
          <GlyphDots className="fill-gray-muted pointer hover-fill-gray transition-all"/>
        </button>
      </div>
      {/* 弹框 */}
      <Modal style={{ top: 20 }} title="广播到应用商店" open={isModalVisible} onOk={handleOk} onCancel={handleCancel}
             okText="提交" cancelText="取消" confirmLoading={confirmLoading}>
        <Form form={form} layout="vertical">
          <Form.Item name="appIpfsHash" label="模型 CID" rules={[{
            required: true,
            message: '请输入 CID'
          }]}>
            <Input disabled/>
          </Form.Item>
          <Form.Item name="appName" label="模型名称" rules={[{
            required: true,
            message: '请输入模型名称'
          }]}>
            <Input/>
          </Form.Item>
          <Form.Item name="modelType" label="应用类型" rules={[{
            required: true,
            message: '请选择一个应用类型'
          }]}>
            <Select onChange={handleType} placeholder="选择应用类型">
              {data.map((item) => {
                return <Option key={item} value={item}>{item}</Option>
              })}
              <Option value="other">其他</Option>
            </Select>
          </Form.Item>
          <Form.Item name="fileSize" label="模型大小" rules={[{
            required: true,
            message: '请输入模型大小'
          }]}>
            <Input disabled/>
          </Form.Item>
          <Form.Item name="introduce" label="应用描述" rules={[{
            required: true,
            message: '请输入应用描述'
          }]}>
            <Input.TextArea/>
          </Form.Item>
          <Form.Item name="logo" label="应用图标颜色" rules={[{
            required: true,
            message: '请选择一个应用图标颜色'
          }]}>
            <Select onChange={handleColorChange} placeholder="选择应用图标颜色">
              <Option value="1">碧波蓝</Option>
              <Option value="2">翠绿蓝</Option>
              <Option value="3">紫霞粉</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

File.propTypes = {
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  size: PropTypes.number,
  cid: PropTypes.instanceOf(CID),
  selected: PropTypes.bool,
  focused: PropTypes.bool,
  onSelect: PropTypes.func,
  onNavigate: PropTypes.func.isRequired,
  onAddFiles: PropTypes.func.isRequired,
  onMove: PropTypes.func.isRequired,
  onDismissFailedPin: PropTypes.func.isRequired,
  coloured: PropTypes.bool,
  translucent: PropTypes.bool,
  handleContextMenuClick: PropTypes.func,
  pinned: PropTypes.bool,
  isMfs: PropTypes.bool
}

File.defaultProps = {
  coloured: false,
  translucent: false
}

export default withTranslation('files')(File)
