"use client"
import { api } from "@/convex/_generated/api";
import { UserButton, useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import Image from "next/image";
import { useEffect } from "react";

export default function Home() {

const {user} = useUser();
const createUser =  useMutation(api.user.createUser);

useEffect(()=>{
  user&&CheckUser();
  console.log('In useEffect')
}, [user])

const CheckUser=async()=>{
  console.log('This is user', user)
  const result = await createUser({
    email:user?.primaryEmailAddress?.emailAddress,
    imageUrl: user?.imageUrl,
    userName:user?.fullName
  })
}

  return (
    <div className="p-4 flex justify-between w-screen">
      I have began
      <UserButton/>
    </div>
  );
}
