import React from 'react'
import { withTranslation, Trans } from 'react-i18next'
import Box from '../../../components/box/Box.js'

const AddFilesInfo = ({ t }) => (
  <div className='mv4 tc navy f5' >
    <Box style={{ background: '#2853e0', color: '#fff' }}>
      <Trans i18nKey='addFilesInfo' t={t}>
        <p className='ma0'>No files here yet! Add files to your local IPFS node by clicking the <strong>Import</strong> button above.</p>
      </Trans>
    </Box>
  </div>
)

export default withTranslation('files')(AddFilesInfo)
