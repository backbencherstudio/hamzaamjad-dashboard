import React from 'react'
import EbookPage from '../_components/Admin/Ebook/EbookPage'
import { EbookProvider } from '@/hooks/useEbook'

export default function Ebook() {
  return (
    <EbookProvider>
      <EbookPage />
    </EbookProvider>

  )
}
