import React, { useState, useRef } from "react";
import Tesseract from "tesseract.js";
import { getAnswer } from "../services/ai-service";
import { toast } from "react-toastify";

const OCRForm = ({
  onResult,
  setLoading,
  setAnswerLoading,
  setQuestion,
  ocrLoading,
}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [ocrResult, setOcrResult] = useState("");
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setImagePreviewUrl(URL.createObjectURL(file));
    setOcrResult("");
    setQuestion("");
  };

  const handleStartOCR = () => {
    if (!selectedFile) {
      toast.warn("Please select an image.");
      return;
    }

    setLoading(true);
    Tesseract.recognize(selectedFile, "eng", {
      logger: (info) => console.log(info),
    })
      .then(({ data: { text } }) => {
        const cleaned = text
          .replace(/10\s*[°o]\s*(\d+)/g, "10^$1")
          .replace(/×/g, "x")
          .trim();
        setOcrResult(cleaned);
        setQuestion(cleaned);
      })
      .catch((err) => {
        console.error(err);
        toast.error("OCR failed");
      })
      .finally(() => setLoading(false));
  };

  const handleSubmit = () => {
    if (!ocrResult.trim()) {
      toast.warn("No text to submit");
      return;
    }

    setAnswerLoading(true);
    getAnswer(ocrResult)
      .then(onResult)
      .catch(() => toast.error("AI service failed"))
      .finally(() => setAnswerLoading(false));
  };

  const handleClear = () => {
    setSelectedFile(null);
    setOcrResult("");
    setImagePreviewUrl("");
    setQuestion("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl">
      <h3 className="text-xl font-semibold mb-3 text-gray-800">Your Doubt:</h3>

      <textarea
        value={ocrResult}
        onChange={(e) => {
          setOcrResult(e.target.value);
          setQuestion(e.target.value);
        }}
        rows={5}
        className="w-full border-2 border-gray-300 rounded-lg p-4 text-lg"
        placeholder="Type or OCR your doubt here..."
      />

      <label className="block mt-4 mb-2 text-lg font-semibold text-gray-700">
        Choose File
      </label>
      <label
        htmlFor="fileInput"
        className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer"
      >
        📂 Browse Image
      </label>
      <input
        id="fileInput"
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {imagePreviewUrl && (
        <div className="my-4">
          <p className="text-lg font-semibold text-gray-700 mb-2">
            Image Preview:
          </p>
          <img
            src={imagePreviewUrl}
            alt="Preview"
            className="w-full max-h-96 object-contain border border-gray-300 rounded-lg"
          />
        </div>
      )}

      <div className="flex flex-wrap gap-3 mt-4">
        <button
          onClick={handleStartOCR}
          disabled={!selectedFile || ocrLoading}
          className={`flex items-center justify-center min-w-[140px] px-4 py-2 rounded-lg transition ${
            ocrLoading
              ? "bg-green-400 text-white cursor-not-allowed"
              : "bg-green-500 hover:bg-green-600 text-white"
          }`}
        >
          {ocrLoading && (
            <svg
              className="animate-spin h-5 w-5 mr-2 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>
          )}
          {ocrLoading ? "Processing..." : "Start OCR"}
        </button>

        <button
          onClick={handleSubmit}
          disabled={!ocrResult.trim()}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
        >
          Submit Question
        </button>

        <button
          onClick={handleClear}
          className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg"
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default OCRForm;
