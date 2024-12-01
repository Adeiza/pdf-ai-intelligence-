import React from 'react'

function PDFViewer({fileUrl}) {
    console.log(fileUrl)
  return (
    <iframe src={fileUrl +"#toolbar=0"} height="90vh" width="100%" className='h-[90vh]'></iframe>
  )
}

export default PDFViewer