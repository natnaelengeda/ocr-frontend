import React from 'react'
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import LoadingSpinner from './loading-spinner';


interface Props {
  image: number,
  handleUpload: () => void;
  open: boolean;
  setOpen: any;
  loading:boolean;
}

export default function TestItemsPreview({ image, handleUpload, open, setOpen,loading }: Props) {

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}>
      <DialogContent className="max-w-sm w-full flex flex-col items-center p-4">
        <img
          src={
            image == 1 ?
              "visible-reciept.jpg" :
              "not-so-visible-reciept.jpg"
          }
          alt="Preview"
          className="w-full object-cover rounded-lg mb-4" />
        <Button
          onClick={handleUpload}
          className="w-full"
            disabled={loading}>
                      {
                        loading &&
                        <LoadingSpinner size={20} />
                      }
          Upload
        </Button>
      </DialogContent>
    </Dialog>
  )
}
