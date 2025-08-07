# OCR Frontend (Next.js)

This is the frontend for the OCR Receipt Extraction App. It is built using **Next.js**, **Tailwind CSS**, and **React**, and is designed to work seamlessly with the [OCR backend](https://github.com/your-backend-repo) which handles file uploads and text extraction.

---

## 🚀 Features

- Upload receipt images (JPG, PNG, etc.)
- Preview uploaded images
- Send images to backend for OCR processing
- Display extracted text

---

## 🛠️ Tech Stack

- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)
- REST API integration with the OCR backend

---

## 🧩 Prerequisites

Before you start, make sure you have the following installed:

- **Node.js** (v18 or higher recommended)
- **npm** or **yarn**
- The [OCR backend](https://github.com/natnaelengeda/ocr-backend.git) running locally at `http://localhost:7454`

---

## ⚙️ Installation

```bash
git clone https://github.com/natnaelengeda/ocr-frontend.git
cd ocr-frontend
npm install
# or
yarn install
```

---

## 🏃 Running the Development Server

```bash
npm run dev
# or
yarn dev
```

This will start the app at [http://localhost:3000](http://localhost:3000).

Make sure your OCR backend is running at `http://localhost:7454`.

---

## 📁 Environment Variables

NO need for environment variables, everything is in the code

---

## 🖼️ Upload Notes

- Maximum image size: **3MB**
- Supported formats: **.jpg**, **.jpeg**, **.png**
- Once uploaded, the image will be previewed and sent to the backend for processing.

---

## 📤 Response Format

The backend should respond with something like:

```json
{
  "success": true,
  "text": "Extracted receipt text here..."
}
```

---

## 🧪 Testing the Upload

You can use the interface to:

- Upload a new receipt
- See a preview before submission
- View extracted text returned by backend
- copy the text

---

## 🧹 Cleanup

To reset your local environment, run:

```bash
rm -rf node_modules
rm package-lock.json # or yarn.lock
npm install
```

---

## 🤝 License

MIT — free to use and modify.

---

## 👨‍💻 Author

Developed by [Natnael Engeda](https://github.com/natnaelengeda)
