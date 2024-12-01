import { UserButton } from '@clerk/nextjs'
import React from 'react'

export const Header = () => {
  return (
    <div className='p-4 flex justify-end w-screen shadow-md'>
        <UserButton />
    </div>
  )
}
