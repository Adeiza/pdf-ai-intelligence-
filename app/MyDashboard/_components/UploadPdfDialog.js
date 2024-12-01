"use client";

import React, { useState } from 'react'

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useAction, useMutation } from 'convex/react'
import { Loader2Icon, LoaderIcon } from 'lucide-react'
import { api } from '@/convex/_generated/api';
import uuid4 from 'uuid4';
import { useUser } from '@clerk/nextjs';
import axios from 'axios';
import { toast } from 'sonner';


function UploadPdfDialog({children, isMaxFile}) {
  const generateUploadUrl=useMutation(api.fileStorage.generateUploadUrl);
  const addFileEntry =useMutation(api.fileStorage.AddFileEntryToDb);
  const getFileUrl=useMutation(api.fileStorage.getFileUrl);
  const embedDocument = useAction(api.myAction.ingest)
  const {user} = useUser();
  console.log('This is user: ', user);
  const [file, setFile]=useState();
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState();
  const [open, setOpen] = useState(false);


  const OnFileSelect = (event)=>{
    setFile(event.target.files[0])
  }

  const OnUpload = async ()=>{
    setLoading(true);
    // Step 1: Get a short-lived upload URL
    const postUrl = await generateUploadUrl();
     // Step 2: POST the file to the URL
    const result = await fetch(postUrl, {
      method: "POST",
      headers: { "Content-Type": file?.type },
      body: file,
    });
    const { storageId } = await result.json();
    console.log('Storage Id: ', storageId);
    const fileId = uuid4();
    const fileUrl = await getFileUrl({storageId:storageId})

    // Step 3: Save the newly allocated storage id to the database
    console.log('Created By: ', user?.primaryEmailAddress?.emailAddress)
    const resp = await addFileEntry({
      fileId:fileId,
      storageId:storageId,
      fileName:fileName??'Untitled File',
      fileUrl: fileUrl,
      createdBy:user?.primaryEmailAddress?.emailAddress
    })

    //api call to fetch PDF Process Data
    const apiResp = await axios.get('api/pdf-loader?pdfUrl='+fileUrl);
    await embedDocument({
      splitText:apiResp.data.result,
      fileId:fileId
    });
    setLoading(false);
    setOpen(false);
    toast('File is ready!')
    // console.log(resp);
  }

  return (
    <Dialog open={open}>
  <DialogTrigger asChild>
    <Button onClick = {()=>{setOpen(true)}} className="w-full" disabled={isMaxFile}>+ PDF Upload</Button>
    </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Upload PDF File</DialogTitle>
      <DialogDescription asChild>
        <div>
            <h2 className='mt-5'>Select File to Upload</h2>
                <div className='gap-2 p-3 border rounded-md'>
                    <input type="file" accept='application/pdf'
                    onChange = {(event)=>{OnFileSelect(event)}}/>    
            </div>
            <div>
                <label>File Name*</label>
                <Input placeholder="File Name..." onChange = {(event)=>{setFileName(event.target.value)}}/>
            </div>
        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
          <Button onClick ={OnUpload} disabled={loading}>
            {
              loading?<Loader2Icon className='animate-spin'/>:'Upload'
            }
          </Button>
        </DialogFooter>
        </div>

      </DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>

  )
}

export default UploadPdfDialog