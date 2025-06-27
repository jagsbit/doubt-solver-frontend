import React, { useState, useRef } from "react";
import Tesseract from "tesseract.js";
import { getAnswer } from "../services/ai-service";
import { toast } from "react-toastify";

const OCRForm = ({ onResult, setLoading, setAnswerLoading, setQuestion }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [ocrResult, setOcrResult] = useState("");
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setImagePreviewUrl(URL.createObjectURL(file));
      setOcrResult("");
      setQuestion(""); // clear parent question too
    }
  };

  const handleStartOCR = () => {
    if (!selectedFile) {
      alert("Please select an image file first!");
      return;
    }

    setLoading(true);
    Tesseract.recognize(selectedFile, "eng", {
      logger: (info) => console.log(info),
    })
      .then(({ data: { text } }) => {
        const cleanedText = text
          .replace(/10\s*[°o]\s*(\d+)/g, "10^$1")
          .replace(/×/g, "x")
          .replace(/\s{2,}/g, " ")
          .trim();

        setOcrResult(cleanedText); // update local
        setQuestion(cleanedText); // propagate up to AskDoubt
      })
      .catch((err) => {
        console.error(err);
        setOcrResult("Error during OCR.");
      })
      .finally(() => setLoading(false));
  };

  const handleSubmit = () => {
    if (!ocrResult.trim()) {
      alert("Please run OCR and/or edit the text before submitting.");
      return;
    }

    setQuestion(ocrResult); // propagate up
    setAnswerLoading(true); // show answer loader
    getAnswer(ocrResult)
      .then((data) => onResult(data))
      .catch((error) => {
        console.error(error);
        toast.error("Some error occurred");
      })
      .finally(() => setAnswerLoading(false));
  };

  const handleClear = () => {
    setSelectedFile(null);
    setOcrResult("");
    setImagePreviewUrl("");
    setQuestion(""); // also clear parent
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl">
      <h3 className="text-xl font-semibold mb-3 text-gray-800">Your Doubt:</h3>
      <textarea
        value={ocrResult}
        onChange={(e) => {
          setOcrResult(e.target.value);
          setQuestion(e.target.value); // propagate manual edits
        }}
        rows={5}
        className="w-full border-2 border-gray-300 rounded-lg p-4 text-lg leading-relaxed"
      />

      <label className="block mt-4 mb-2 text-lg font-semibold text-gray-700">
        Choose File
      </label>
      <label
        htmlFor="fileInput"
        className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer text-base font-medium"
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
            alt="Uploaded Preview"
            className="w-full max-h-96 object-contain border border-gray-300 rounded-lg shadow"
          />
        </div>
      )}

      <div className="flex flex-wrap gap-3 mt-4">
        <button
          onClick={handleStartOCR}
          disabled={!selectedFile}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-base font-medium disabled:opacity-50"
        >
          Start OCR
        </button>
        <button
          onClick={handleSubmit}
          disabled={!ocrResult.trim()}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-base font-medium disabled:opacity-50"
        >
          Submit Question
        </button>
        <button
          onClick={handleClear}
          className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg text-base font-medium"
        >
          Clear Form
        </button>
      </div>
    </div>
  );
};

export default OCRForm;
