import React, { useEffect, useState } from "react";
import { getQuiz } from "../../services/ai-service";
import { useParams } from "react-router-dom";
import { getDoubtById } from "../../services/doubt-service";
import Spinner from "../Spinner";

const QuizeMe = () => {
  const [quizData, setQuizData] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({}); // {questionIndex: "A"/"B"/"C"/"D"}
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const { doubtId } = useParams();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getDoubtById(doubtId)
      .then((data) => {
        //console.log(data);
        setLoading(true);
        getQuiz(data.content)
          .then((response) => {
            setQuizData(response);
          })
          .catch((error) => {
            console.error(error);
          })
          .finally(() => setLoading(false));
      })
      .catch((error) => {
        console.log(error);
      });
  }, [doubtId]);

  const handleOptionChange = (questionIndex, option) => {
    setSelectedOptions((prev) => ({ ...prev, [questionIndex]: option }));
  };

  const handleSubmit = () => {
    let correctCount = 0;
    quizData.forEach((q, index) => {
      if (selectedOptions[index] === q.answer) {
        correctCount++;
      }
    });
    setScore(correctCount);
    setSubmitted(true);
  };

  return (
    <div className="p-4 max-w-2xl mx-auto space-y-4">
      {loading && (
        <Spinner text={"Loading questions..."}/>
      )}

      {/* Questions */}
      {quizData.length > 0 &&
        quizData.map((q, index) => {
          // Check if user chose the wrong answer
          const userAnswer = selectedOptions[index];
          const isWrongAnswer =
            submitted && userAnswer && userAnswer !== q.answer;

          return (
            <div
              key={index}
              className={`p-4 border rounded space-y-2 ${
                isWrongAnswer ? "bg-red-100" : ""
              }`}
            >
              <h2 className="font-medium">
                {index + 1}. {q.question}
              </h2>

              {["A", "B", "C", "D"].map((option) => {
                const optionKey = `option${option}`;
                const optionText = q[optionKey];
                const isCorrect = q.answer === option;
                const isSelected = selectedOptions[index] === option;

                return (
                  <label key={option} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name={`q${index}`}
                      value={option}
                      checked={isSelected}
                      disabled={submitted}
                      onChange={() => handleOptionChange(index, option)}
                    />
                    <span
                      className={`${
                        submitted
                          ? isCorrect
                            ? "text-green-600 font-bold"
                            : isSelected
                            ? "text-red-600"
                            : ""
                          : ""
                      }`}
                    >
                      {option}: {optionText}
                    </span>
                  </label>
                );
              })}
            </div>
          );
        })}

      {/* Submit */}
      {quizData.length > 0 && !submitted && (
        <button
          onClick={handleSubmit}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Submit Quiz
        </button>
      )}

      {/* Score */}
      {submitted && (
        <div className="text-center mt-4 text-xl font-bold">
          🎯 Your score: {score}/{quizData.length}
        </div>
      )}
    </div>
  );
};

export default QuizeMe;
