import React from "react";
import ReactMarkdown from "react-markdown";
import loadingImg from "../assets/loading.webp";

const AnswerDisplay = ({ answer, loading, onClear }) => {
  const isAnswerEmpty = !answer.trim();

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-full min-h-[200px] flex flex-col">
      <h3 className="text-2xl font-bold mb-4 text-gray-800">
        Answer from DoubtNest.Ai:
      </h3>

      <div className="relative flex-1 mb-4">
        {loading && (
          <img
            src={loadingImg}
            alt="Loading..."
            className="w-10 h-10 absolute top-0 left-0"
          />
        )}
        <div
          className={`prose prose-lg overflow-auto pl-12 ${loading ? "opacity-50" : ""}`}
        >
          <ReactMarkdown>{answer}</ReactMarkdown>
        </div>
      </div>

      {!isAnswerEmpty && !loading && (
        <button
          onClick={onClear}
          className="self-end bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
        >
          Clear Answer
        </button>
      )}
    </div>
  );
};

export default AnswerDisplay;
