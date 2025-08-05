import React from 'react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from './ui/button';

interface IPreviewImage {
  imagePreview: string;
  handleUploadClick: () => void;
  open: boolean;
  setOpen: any;
}

export default function PreviewImage({ imagePreview, handleUploadClick, open, setOpen }: IPreviewImage) {
  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Preview Image</DialogTitle>
          <DialogDescription>
            <div
              className='w-full h-auto flex flex-col items-start justify-start gap-5'>

              <img
                src={imagePreview || ""}
                alt="Reciept Image" />


              <div className='flex flex-row items-center justify-start gap-3'>
                {
                  imagePreview &&
                  <>
                    <Button
                      onClick={() => {
                        setOpen(false);
                        handleUploadClick();
                      }}>
                      Upload Again
                    </Button>
                    <Button>Confirm</Button></>
                }
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
