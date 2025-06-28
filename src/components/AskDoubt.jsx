import React, { useEffect, useState } from "react";
import OCRForm from "./OCRForm";
import AnswerDisplay from "./AnswerDisplay";
import { getUser, isLoggedin } from "../auth";
import { loadAllCategories } from "../services/category-service";
import { saveDoubt } from "../services/doubt-service";
import { toast } from "react-toastify";

const AskDoubt = () => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCatId, setSelectedCatId] = useState("");
  const [answerLoading, setAnswerLoading] = useState(false);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [user, setUser] = useState({});
  const isLoggedIn = isLoggedin();

  const [publishLoading, setPublishLoading] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      setUser(getUser());
      loadAllCategories()
        .then(setCategories)
        .catch(() => toast.error("Failed to load categories"));
    }
  }, [isLoggedIn]);

  const handleResult = (result) => {
    setAnswer(result);
    setAnswerLoading(false);
  };

  const handleSubmit = () => {
    if (!question.trim() || !answer.trim() || !selectedCatId) {
      toast.warn("Please ensure all fields are filled in.");
      return;
    }

    setPublishLoading(true); // start spinner

    saveDoubt(question, answer, user.userId, selectedCatId)
      .then(() => {
        toast.success("Doubt saved successfully");
        setQuestion("");
        setAnswer("");
        setSelectedCatId("");
      })
      .catch(() => toast.error("Failed to save doubt"))
      .finally(() => setPublishLoading(false)); // stop spinner
  };

  const isAnswerInvalid =
    !answer.trim() ||
    answer === "Your doubt is not related to Academics" ||
    answer ===
      "You’ve exceeded your free usage limit for today. Please upgrade to a standard subscription to continue.";

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <OCRForm
        onResult={handleResult}
        setLoading={setOcrLoading}
        setAnswerLoading={setAnswerLoading}
        setQuestion={setQuestion}
        ocrLoading={ocrLoading}
      />

      <div className="mt-6">
        <AnswerDisplay
          answer={answer}
          loading={answerLoading}
          onClear={() => setAnswer("")}
        />
      </div>

      {isLoggedIn && (
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-6">
          <select
            className="border border-gray-300 rounded-lg p-2 w-full sm:w-auto"
            value={selectedCatId}
            onChange={(e) => setSelectedCatId(e.target.value)}
            disabled={isAnswerInvalid}
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

          <button
            disabled={isAnswerInvalid || !selectedCatId || publishLoading}
            onClick={handleSubmit}
            className={`flex items-center justify-center gap-2 min-w-[180px] px-6 py-2 rounded-lg shadow-md font-semibold transition duration-200 ${
              isAnswerInvalid || !selectedCatId || publishLoading
                ? "bg-blue-400 text-white cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {publishLoading && (
              <svg
                className="animate-spin h-5 w-5 text-white mr-2"
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
            {publishLoading ? "Publishing..." : "Publish to Community"}
          </button>
        </div>
      )}
    </div>
  );
};

export default AskDoubt;
