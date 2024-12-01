import React from 'react'
import { SideBar } from '../MyDashboard/_components/SideBar'
// import Sidebar from './_components/Sidebar'

function DashboardLayout({children}) {
  return (
    <div>
        <div className='md:w-64 h-screen fixed'>
            <SideBar/>
        </div>
        <div className='md:ml-64 p-10 w-full'>
            {children}
        </div>
    </div>
  )
}

export default DashboardLayout