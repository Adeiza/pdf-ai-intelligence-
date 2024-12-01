"use client"

import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Layout, Shield } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import UploadPdfDialog from './UploadPdfDialog'
import { useUser } from '@clerk/nextjs'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
// import UploadPdfDialog from './UploadPdfDialog'

export const SideBar = () => {

    const {user} = useUser();
    const path =usePathname();

  const fileList = useQuery(api.fileStorage.GetUserFiles, {
    userEmail:user?.primaryEmailAddress?.emailAddress
  });

  return (
    <div className='shadow-md h-screen p-7'>
        <Image src={'/logo.svg'} alt='logo' width={170} height={120} />
        <div className='mt-10'>
            <UploadPdfDialog isMaxFile={fileList?.length>=5?true:false}>
                <Button className='w-full'>+Upload PDF</Button>
            </UploadPdfDialog>
           
           <Link href={'/dashboard'}>
            <div className={`flex gap-2 mt-5 p-3 items-center cursor-pointer hover:bg-slate-100 rounded-md ${path=='/dashboard'&& 'bg-slate-200'}`}>
                <Layout />
                <h2>Workspace</h2>
            </div>
            </Link>

            <Link href={'/dashboard/upgrade'}>
            <div className={`flex gap-2 mt-1 p-3 items-center cursor-pointer hover:bg-slate-100 rounded-md ${path=='/dashboard/upgrade'&& 'bg-slate-200'}`}>
                <Shield />
                <h2>Upgrade</h2>
            </div>
            </Link>
            <div className='absolute w-[80%] bottom-12'>
                <Progress value={(fileList?.length/5)*100} />
                <p className='text-sm mt-1'>{fileList?.length} out of 5 pdf uploaded</p>
                <p className='text-sm text-gray-400 mt-1'>Upgrade to Upload More PDFs</p>
                
            </div>
        </div>
    </div>
  )
}
