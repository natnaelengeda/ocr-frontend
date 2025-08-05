import React, { useCallback, useRef, useState } from 'react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import Webcam from 'react-webcam';
import { Button } from './ui/button';

interface IPreviewImage {
  open: boolean;
  setOpen: any;
}

export default function TakePicture({ open, setOpen }: IPreviewImage) {
  const [image, setImage] = useState(null);

  const webcamRef = useRef<any>(null);
  const capture = useCallback(
    () => {
      const imageSrc = webcamRef.current.getScreenshot();
      setImage(imageSrc)
    },
    [webcamRef, setImage]
  );

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Take Picture</DialogTitle>
          <DialogDescription>
            <div
              className='w-full h-auto flex flex-col items-start justify-start gap-5'>
              {
                image ?
                  <img
                    src={image || ""}
                    alt="Reciept Image" /> :
                  <Webcam
                    height={720}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    width={1280} />
              }

              <div className='flex flex-row items-center justify-start gap-3'>

                {
                  image ?
                    <Button
                      onClick={() => setImage(null)}>
                      Retake Picture
                    </Button> :
                    <Button
                      onClick={() => {
                        capture()
                      }}>
                      Take Picture
                    </Button>
                }
                {
                  image &&
                  <Button>Upload</Button>
                }
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
