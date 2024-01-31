import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'redux-bundler-react'
import { withTranslation } from 'react-i18next'
import { normalizeFiles } from '../../lib/files.js'
// Icons
import DocumentIcon from '../../icons/StrokeDocument.js'
import FolderIcon from '../../icons/StrokeFolder.js'
import NewFolderIcon from '../../icons/StrokeNewFolder.js'
import DecentralizationIcon from '../../icons/StrokeDecentralization.js'
// Components
import Button from '../../components/button/Button.js'
import '../../css/style.css'

class FileInput extends React.Component {
  onInputChange = (input) => async () => {
    this.props.onAddFiles(normalizeFiles(input.files))
    input.value = null
  }

  render () {
    const {
      t,
      onAddFiles,
      onAddByPath,
      onNewFolder
    } = this.props

    return (
      <div className={this.props.className}>
        {/* <Button id="add-file" bg="bg-navy" color="white" className="textButton f6 flex justify-center items-center" */}
        {/*         minWidth="100px"> */}
        {/*   /!* <DocumentIcon className='fill-aqua w2 mr1' /> *!/ */}
        {/*   {'获取站外模型'} */}
        {/* </Button> */}

        <Button id="add-file" bg="bg-navy" color="white" className="textButton f6 flex justify-center items-center"
                minWidth="100px" onClick={() => this.folderInput.click()}>
          {/* <DocumentIcon className='fill-aqua w2 mr1' /> */}
          {'上传文件夹'}
        </Button>

        <Button id="add-folder" bg="bg-navy" color="white" className="f6 flex justify-center items-center"
                minWidth="100px" onClick={() => this.filesInput.click()}>
          {/* <FolderIcon className='fill-aqua w2 mr1' /> */}
          {'上传模型包文件'}
        </Button>

        {/* <Button id='add-by-path' bg='bg-navy' color='white' className='f6 flex justify-center items-center' */}
        {/*         minWidth='100px' onClick={onAddByPath}> */}
        {/*   <DecentralizationIcon className='fill-aqua w2 mr1' /> */}
        {/*   {t('addByPath')} */}
        {/* </Button> */}

        {/* <Button id='add-new-folder' bg='bg-navy' color='white' className='f6 flex justify-center items-center' */}
        {/*         minWidth='100px' onClick={onNewFolder}> */}
        {/*   <NewFolderIcon className='fill-aqua w2 h2 mr1' /> */}
        {/*   {t('newFolder')} */}
        {/* </Button> */}

        <input
          id="file-input"
          type="file"
          className="dn"
          multiple
          ref={el => {
            this.filesInput = el
          }}
          onChange={this.onInputChange(this.filesInput)}/>

        <input
          id="directory-input"
          type="file"
          className="dn"
          multiple
          webkitdirectory="true"
          ref={el => {
            this.folderInput = el
          }}
          onChange={this.onInputChange(this.folderInput)}/>
      </div>
    )
  }
}

FileInput.propTypes = {
  t: PropTypes.func.isRequired,
  onAddFiles: PropTypes.func.isRequired,
  onAddByPath: PropTypes.func.isRequired,
  onNewFolder: PropTypes.func.isRequired
}

export default connect(
  'selectIsCliTutorModeEnabled',
  'doOpenCliTutorModal',
  'doSetCliOptions',
  withTranslation('files')(FileInput)
)
