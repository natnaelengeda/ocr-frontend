"use client";
import { useState, useRef, useEffect } from "react";

// icons
import PreviewImage from "@/components/preview-image";
import TakePicture from "@/components/take-picture";

// icons
import { Camera, Upload } from "lucide-react";
import { gql, useApolloClient, useMutation } from "@apollo/client";
import toast from "react-hot-toast";

export default function Home() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const MAX_FILE_SIZE_MB = 3;
  const [uploadFile, setUploadFile] = useState<any>(null);

  const [openPreview, setOpenPreview] = useState(false);
  const [openPictureModal, setOpenPictureModal] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  //   const CREATE_RECEIPT_WITH_UPLOAD = gql`
  //   mutation CreateReceiptWithUpload($image: Upload!) {
  //     createReceiptWithUpload(image: $image) {
  //       id
  //       storeName
  //       purchaseDate
  //       totalAmount
  //       imageUrl
  //       createdAt
  //       items {
  //         id
  //         name
  //         quantity
  //       }
  //     }
  //   }
  // `;

  // Define your GraphQL mutation
  const CREATE_RECEIPT_WITH_UPLOAD = gql`
  mutation createReceiptWithUpload($image: Upload!) {
    createReceiptWithUpload(image: $image) {
      id
      url
      createdAt
    }
  }
`;

  const [createReceipt] = useMutation(CREATE_RECEIPT_WITH_UPLOAD);
  const apolloClient = useApolloClient();


  const handleUploadClick = () => {
    fileInputRef.current?.click(); // Trigger file input
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

    // ✅ Process the image file here (e.g., upload to server or preview)
    console.log("Accepted image:", file);
    setUploadFile(file);
    // uploadImage(file);
    // uploadReceiptImage(file);
  };

  const uploadFunction = async () => {
    try {
      console.log(uploadFile)
      // await createReceipt({
      //   variables: {
      //     image: uploadFile
      //   }
      // });
      // apolloClient.resetStore(); // Refresh any relevant cached data
    } catch (error) {
      console.error("Upload failed:", error);
      // Optional: show a UI error message here
    }
  }



  interface ReceiptItem {
    id: string;
    name: string;
    quantity: number;
  }

  interface Receipt {
    id: string;
    storeName: string;
    purchaseDate: string;
    totalAmount: number;
    imageUrl: string;
    createdAt: string;
    items: ReceiptItem[];
  }

  interface UploadResult {
    success: boolean;
    receipt?: Receipt;
    error?: string;
  }


  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-8 px-4 bg-gray-50">
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
          setOpen={setOpenPreview} />}
      <TakePicture open={openPictureModal} setOpen={setOpenPictureModal} />
    </div>
  );
}
