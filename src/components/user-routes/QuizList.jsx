import React, { useEffect, useState, useRef, useCallback } from "react";
import { getUser } from "../../auth";
import { getDoubtByUser } from "../../services/doubt-service";
import { useNavigate } from "react-router-dom";

const QuizList = () => {
  const user = getUser();
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true); // Initially true because we haven't loaded yet
  const navigate = useNavigate();

  const loaderRef = useRef();

  const fetchDoubts = async (pageNum) => {
    setLoading(true); 
    const startTime = Date.now();

    try {
      const response = await getDoubtByUser(user?.userId, pageNum);
      setData((prev) => [...prev, ...response.content]);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error(error);
    } finally {
      // Ensure loader stays visible for at least 2s
      const elapsed = Date.now() - startTime;
      const remaining = 2000 - elapsed;
      setTimeout(() => setLoading(false), remaining > 0 ? remaining : 0);
    }
  };

  useEffect(() => {
    fetchDoubts(page);
  }, [page]);

  const observerCallback = useCallback(
    (entries) => {
      if (entries[0].isIntersecting && !loading && page < totalPages - 1) {
        setPage((prev) => prev + 1);
      }
    },
    [loading, page, totalPages]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(observerCallback, { threshold: 1 });
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [observerCallback]);

  const handleStartQuiz = (doubtId) => navigate(`/private/quize-me/${doubtId}`);

  return (
    <div className="p-4 min-h-[60vh] flex flex-col">
      <h1 className="text-2xl font-bold mb-4">Your Doubts</h1>

      {/* 1️⃣ Show loader if we’re still waiting for data */}
      {loading && data.length === 0 && (
        <div className="flex justify-center mt-8 text-blue-500 text-2xl font-semibold">
          ⏳ Loading your doubts...
        </div>
      )}

      {/* 2️⃣ Show "no doubts" message if data loaded but empty */}
      {!loading && data.length === 0 && (
        <p className="text-center text-gray-500 mt-8 text-lg">
          It looks like you haven't posted any doubts yet. Once you add some, they'll appear here so you can quiz yourself!
        </p>
      )}

      {/* 3️⃣ Show the list of data if we have any */}
      {data.length > 0 && data.map((doubt) => (
        <div
          key={doubt.doubtId}
          className="flex items-center justify-between border border-gray-300 p-4 mb-2 rounded shadow"
        >
          <p className="flex-1 mr-4">{doubt.content}</p>
          <button
            onClick={() => handleStartQuiz(doubt.doubtId)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Start Quiz
          </button>
        </div>
      ))}

      {/* Intersection loader */}
      {loading && data.length > 0 && (
        <div className="flex justify-center mt-4 text-blue-500 text-xl">
          ⏳ Loading more doubts...
        </div>
      )}

      <div ref={loaderRef} style={{ height: "20px" }} />
    </div>
  );
};

export default QuizList;
