import React, { useContext } from 'react'
import { Translation } from 'react-i18next'
import { url } from '../url'
import AttachmentLinkAnchor from './AttachmentLinkAnchor'
import { ExamContext } from './ExamContext'
import { ExamComponentProps } from './types'

function AttachmentLink({ element }: ExamComponentProps) {
  const name = element.getAttribute('ref')!
  const { root, attachmentsURL } = useContext(ExamContext)
  const attachment = root.querySelector(`attachment[name="${name}"]`)!
  const displayNumber = attachment.getAttribute('display-number')!
  const isShort = element.getAttribute('type') === 'short'
  const href = url(attachmentsURL, { hash: displayNumber })

  return isShort ? (
    <AttachmentLinkAnchor href={href}>{displayNumber}</AttachmentLinkAnchor>
  ) : (
    <>
      {'('}
      <AttachmentLinkAnchor href={href}>
        <Translation>{t => t('material').toLowerCase()}</Translation> {displayNumber}
      </AttachmentLinkAnchor>
      {')'}
    </>
  )
}

export default React.memo(AttachmentLink)
