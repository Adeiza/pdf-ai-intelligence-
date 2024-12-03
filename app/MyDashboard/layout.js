import React from 'react'
import { Header } from './_components/Header'
import { SideBar } from './_components/SideBar'

function layout({children}) {
  return (
    <div>
      <div className='md:w-64 h-screen fixed'>
        <SideBar />
      </div>
      <div className='md:ml-60'>
        <Header/>
        <div className='p-10'>
          {children}
        </div>
      </div> 
    </div>
  )
}

export default layout