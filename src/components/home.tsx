
"use client";
import { useState, useRef, useEffect } from "react";

// components
import PreviewImage from "@/components/preview-image";
import TakePicture from "@/components/take-picture";
import toast from "react-hot-toast";

// icons
import { Camera, Upload } from "lucide-react";
import TestItemsPreview from "./test-items-preview";

export default function Home({ fetchReceipts }: any) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const MAX_FILE_SIZE_MB = 3;
  const [uploadFile, setUploadFile] = useState<any>(null);

  const [openPreview, setOpenPreview] = useState(false);
  const [openPictureModal, setOpenPictureModal] = useState(false);
  const [openTestModal, setOpenTestModals] = useState(false);
  const [testImage, setTestImage] = useState<number | null>(null);

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [loading, setloading] = useState(false);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const isImage = file.type.startsWith("image/");
    const isTooLarge = file.size > MAX_FILE_SIZE_MB * 1024 * 1024;

    if (!isImage) {
      setError("Only image files are allowed.");
      return;
    }

    if (isTooLarge) {
      setError("File size must be less than 3MB.");
      return;
    }

    setError(null);

    const imageURL = URL.createObjectURL(file);
    setImagePreview(imageURL);
    setOpenPreview(true)

    console.log("Accepted image:", file);
    setUploadFile(file);
  };

  const uploadFunction = async () => {
    try {
      setloading(true);

      const operations = JSON.stringify({
        query: `
      mutation ($image: Upload!) {
        uploadReceipt(image: $image) {
          status
          message
          imageUrl
        }
      }
    `,
        variables: {
          image: null,
        },
      });

      const map = JSON.stringify({
        "0": ["variables.image"],
      });

      const formData = new FormData();
      formData.append("operations", operations);
      formData.append("map", map);
      formData.append("0", uploadFile);

      const res = await fetch("http://localhost:7454/graphql", {
        method: "POST",
        body: formData,
        headers: {
          "x-apollo-operation-name": "UploadReceipt",
        },
      });


      if (res.status == 200) {
        toast.success("Upload successful!");
        fetchReceipts(true);
        setOpenPreview(false)
        setloading(false);
      } else {
        toast.error("Unable to Read Reciept, Try Another One");
        setloading(false);
      }

    } catch (error) {
      console.error("Upload failed:", error);
    }
  }

  const uploadTestImages = async () => {
    try {
      setloading(true);

      const operations = JSON.stringify({
        query: `
      mutation ($image: Upload!) {
        uploadReceipt(image: $image) {
          status
          message
          imageUrl
        }
      }
    `,
        variables: {
          image: null,
        },
      });

      const map = JSON.stringify({
        "0": ["variables.image"],
      });

      if (testImage) {
        const imageUrl = (testImage == 1 ? "./visible-reciept.jpg" : "./not-so-visible-reciept.jpg");
        const response = await fetch(imageUrl)
        const blob = await response.blob()

        const formData = new FormData();
        formData.append("operations", operations);
        formData.append("map", map);
        formData.append("0", blob);

        const res = await fetch("http://localhost:7454/graphql", {
          method: "POST",
          body: formData,
          headers: {
            "x-apollo-operation-name": "UploadReceipt",
          },
        });


        if (res.status == 200) {
          toast.success("Upload successful!");
          fetchReceipts(true);
          setOpenPreview(false)
          setloading(false);
          setOpenTestModals(false);
        } else {
          toast.error("Unable to Read Reciept, Try Another One");
          setloading(false);
        }
      } else {
        toast.error("Test Image Not Selected")
      }
    } catch (error) {
      console.error("Upload failed:", error);
    }
  }


  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <div className="w-full flex flex-col items-center justify-start py-8 px-4 ">
      {/* Title */}
      <div className="text-center max-w-3xl mb-10 px-2">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-3">
          Receipt OCR & Data Extraction
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-gray-700 max-w-xl mx-auto">
          Upload receipt images and extract structured data automatically
        </p>
      </div>

      {/* Upload Receipt Area */}
      <div className="w-full max-w-4xl px-2">
        <div className="w-full bg-white rounded-xl border border-gray-300 p-6 flex flex-col sm:flex-row sm:justify-center sm:gap-8 gap-6 shadow-md">
          {/* Take Picture */}
          <button
            type="button"
            onClick={() => setOpenPictureModal(true)}
            className="flex flex-col items-center justify-center w-full sm:w-48 h-48 border border-gray-300 rounded-xl hover:border-blue-500 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
            <Camera className="w-10 h-10 text-gray-600 mb-3" />
            <span className="text-gray-700 font-medium text-lg">Take Picture</span>
          </button>

          {/* Upload Picture */}
          <button
            type="button"
            onClick={handleUploadClick}
            className="flex flex-col items-center justify-center w-full sm:w-48 h-48 border border-gray-300 rounded-xl hover:border-blue-500 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
            <Upload className="w-10 h-10 text-gray-600 mb-3" />
            <span className="text-gray-700 font-medium text-lg">Upload Image</span>
          </button>

          <button
            className="flex flex-col items-center justify-center w-full sm:w-48 h-48 border border-gray-300 rounded-xl hover:border-blue-500 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer overflow-hidden">
            <div className="w-full h- flex flex-col items-center justify-start p-2 gap-2" >
              <span
                onClick={() => {
                  setOpenTestModals(true);
                  setTestImage(1);
                }}
                className="w-full h-12 border border-rounded flex items-center justify-center text-lg bg-blue-600 text-white rounded-xl box-transition">
                Visible Reciept
              </span>
              <span
                onClick={() => {
                  setOpenTestModals(true)
                  setTestImage(2);
                }}
                className="w-full h-15 border border-rounded flex items-center justify-center text-lg bg-primary text-white rounded-xl box-transition">
                Not So Visible Reciept
              </span>
            </div>
            <span className="text-gray-700 font-medium text-lg">Test Reciepts</span>
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </div>

      {imagePreview &&
        <PreviewImage
          imagePreview={imagePreview}
          handleUploadClick={handleUploadClick}
          uploadFunction={uploadFunction}
          open={openPreview}
          loading={loading}
          setOpen={setOpenPreview} />
      }

      <TakePicture
        open={openPictureModal}
        setOpen={setOpenPictureModal} />

      {
        testImage &&
        <TestItemsPreview
          open={openTestModal}
          setOpen={setOpenTestModals}
          image={testImage}
          handleUpload={uploadTestImages}
          loading={loading} />
      }

    </div>
  );
}
