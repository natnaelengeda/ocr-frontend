"use client";
import { useState, useRef } from "react";

// icons
import PreviewImage from "@/components/preview-image";
import TakePicture from "@/components/take-picture";

// icons
import { Camera, Upload } from "lucide-react";
import { gql, useApolloClient } from "@apollo/client";

export default function Home() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const MAX_FILE_SIZE_MB = 3;
  const apolloClient = useApolloClient();

  const [openPreview, setOpenPreview] = useState(false);
  const [openPictureModal, setOpenPictureModal] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const CREATE_RECEIPT_WITH_UPLOAD = gql`
  mutation CreateReceiptWithUpload($image: Upload!) {
    createReceiptWithUpload(image: $image) {
      id
      storeName
      purchaseDate
      totalAmount
      imageUrl
      createdAt
      items {
        id
        name
        quantity
      }
    }
  }
`;

  const handleUploadClick = () => {
    fileInputRef.current?.click(); // Trigger file input
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    // uploadImage(file);
    uploadReceiptImage(file);
  };



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

  const uploadReceiptImage = async (
    file: File,
    graphqlEndpoint: string = 'http://localhost:7454/graphql'
  ): Promise<UploadResult> => {
    try {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        return {
          success: false,
          error: 'Please select an image file'
        };
      }

      // Validate file size (optional - adjust as needed)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        return {
          success: false,
          error: 'File size too large. Please select a file under 10MB'
        };
      }

      // Create FormData for multipart/form-data request
      const formData = new FormData();

      // GraphQL operation
      const operations = JSON.stringify({
        query: `
        mutation CreateReceiptWithUpload($image: Upload!) {
          createReceiptWithUpload(image: $image) {
            id
            storeName
            purchaseDate
            totalAmount
            imageUrl
            createdAt
            items {
              id
              name
              quantity
            }
          }
        }
      `,
        variables: {
          image: null
        }
      });

      // Map for file uploads
      const map = JSON.stringify({
        "0": ["variables.image"]
      });

      // Append required fields for GraphQL multipart request
      formData.append('operations', operations);
      formData.append('map', map);
      formData.append('0', file);

      // Make the request
      const response = await fetch(graphqlEndpoint, {
        method: 'POST',
        body: formData,
        // Note: Don't set Content-Type header, let the browser set it with boundary
        headers: {
          // Add any auth headers here if needed
          // 'Authorization': `Bearer ${token}`,
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      // Check for GraphQL errors
      if (result.errors) {
        throw new Error(result.errors[0].message || 'GraphQL error occurred');
      }

      return {
        success: true,
        receipt: result.data.createReceiptWithUpload
      };

    } catch (error: any) {
      console.error('Upload error:', error);
      return {
        success: false,
        error: error.message || 'Failed to upload receipt'
      };
    }
  };

  async function uploadImage(file: File) {
    const operations = JSON.stringify({
      query: `
      mutation UploadReceipt($file: Upload!) {
        uploadReceipt(file: $file) {
          id
          storeName
          purchaseDate
          totalAmount
          imageUrl
        }
      }
    `,
      variables: {
        file: null,
      },
    });

    const map = JSON.stringify({
      "0": ["variables.file"],
    });

    const formData = new FormData();
    formData.append("operations", operations);
    formData.append("map", map);
    formData.append("0", file);

    const res = await fetch('http://localhost:7454/graphql', {
      method: "POST",
      body: formData,
    });

    const result = await res.json();
    return result.data.uploadReceipt;
  }

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
          open={openPreview}
          setOpen={setOpenPreview} />}
      <TakePicture open={openPictureModal} setOpen={setOpenPictureModal} />
    </div>
  );
}
