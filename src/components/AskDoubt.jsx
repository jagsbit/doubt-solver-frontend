import React, { useEffect, useState } from "react";
import OCRForm from "./OCRForm";
import AnswerDisplay from "./AnswerDisplay";
import { getUser, isLoggedin } from "../auth";
import { loadAllCategories } from "../services/category-service";
import { saveDoubt } from "../services/doubt-service";
import { toast } from "react-toastify";

const AskDoubt = () => {
  const [question, setQuestion] = useState(""); // NEW: to hold the question
  const [answer, setAnswer] = useState("");
  const [selectedCatId, setSelectedCatId] = useState(""); // NEW: for category
  const [answerLoading, setAnswerLoading] = useState(false); 
  const [ocrLoading, setOcrLoading] = useState(false); 

  const [user, setUser] = useState({});
  const [categories, setCategories] = useState([]);
  const isLoggedIn = isLoggedin();

  const handleResult = (result) => {
    setAnswer(result);
    setAnswerLoading(false); 
  };

  const handleSubmit = () => {
    // Print all required data
    // console.log("Question:", question);
    // console.log("Answer:", answer);
    // console.log("User ID:", user?.userId || "unknown"); 
    // console.log("Selected Category ID:", selectedCatId);

   saveDoubt(question, answer, user.userId, selectedCatId)
  .then((data) => {
    toast.success('Doubt saved successfully');
  })
  .catch(() => {
    toast.error('Failed to save doubt');
  });


  };

  useEffect(() => {
    if (isLoggedIn) {
      setUser(getUser());
      loadAllCategories()
        .then((data) => {
          setCategories(data);
        })
        .catch((error) => {
          console.error(error);
          toast.error("Failed to load categories");
        });
    }
  }, [isLoggedIn]);

  const isAnswerEmpty = !answer || answer.trim() === "" || answer==="Your doubt is not related to Academics" || answer=="You’ve exceeded your free usage limit for today. Please upgrade to a standard subscription to continue.";

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* OCR Form */}
      <OCRForm
        onResult={handleResult}
        setLoading={setOcrLoading}
        setAnswerLoading={setAnswerLoading}
        setQuestion={setQuestion} // pass this if OCR can set the question
      />

      {/* Answer Display */}
      <div className="mt-6">
        <AnswerDisplay
          answer={answer}
          loading={answerLoading}
          onClear={() => setAnswer("")}
        />
      </div>

      {/* Save and Publish Buttons */}
      {isLoggedIn && (
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
          {/* Category Dropdown */}
          <select
            className="border border-gray-300 rounded-lg p-2"
            value={selectedCatId}
            onChange={(e) => setSelectedCatId(e.target.value)}
            disabled={isAnswerEmpty} // Disabled until we have an answer
          >
            <option value="" disabled>
              Select Category
            </option>
            {categories.map((cat) => (
              <option key={cat.catId} value={cat.catId}>
                {cat.catName}
              </option>
            ))}
          </select>

          {/* Publish Button */}
          <button
            disabled={isAnswerEmpty || !selectedCatId}
            className={`${
              isAnswerEmpty || !selectedCatId
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            } text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-200`}
            onClick={handleSubmit}
          >
            Publish to Community
          </button>
        </div>
      )}
    </div>
  );
};

export default AskDoubt;
