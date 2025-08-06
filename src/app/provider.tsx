"use client";

import React from 'react'
import { Toaster } from 'react-hot-toast';


export default function Provider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster />
    </>
  )
}
