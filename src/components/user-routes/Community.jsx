import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { toast } from "react-toastify";
import { FaArrowUp } from "react-icons/fa";

import { getAllDoubt } from "../../services/doubt-service";
import { getUser } from "../../auth";
import CategoryNav from "./CategoryNav";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { addComment, upVote } from "../../services/comment-service";

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

const Community = () => {
  const { catId } = useParams();

  const [data, setData] = useState({
    content: [],
    totalPages: 0,
    lastPage: false,
  });
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("pageNumber")) || 0;
  const user = getUser();
  const [readMoreStates, setReadMoreStates] = useState({});
  const [commentTexts, setCommentTexts] = useState({});

  useEffect(() => {
    getAllDoubt(currentPage, catId)
      .then((res) => {
        setData(res);
        //console.log(res);
      })
      .catch((error) => {
        console.error(error);
        toast.error("Failed to load the doubts");
      });
  }, [currentPage, catId, commentTexts]);

  const goToPage = (page) => setSearchParams({ pageNumber: page });

  const toggleReadMore = (doubtId) => {
    setReadMoreStates((prev) => ({ ...prev, [doubtId]: !prev[doubtId] }));
  };

  const handleComment = (doubtId) => {
    const comment = commentTexts[doubtId] || "";
    if (!comment.trim()) return toast.warning("Comment cannot be empty!");
    const commentdto = {
      content: comment,
      createdAt: new Date().toISOString(),
    };

    addComment(commentdto, user?.userId, doubtId)
      .then((data) => {
        if (data.commentId === 0) {
          toast.error("Your comment is irrelevant");
        } else {
          toast.info("Comment added successfully");

          setData((prevData) => {
            const updatedContent = prevData.content.map((doubt) => {
              if (doubt.doubtId === doubtId) {
                return {
                  ...doubt,
                  comments: [...(doubt.comments || []), data],
                };
              }
              return doubt;
            });
            return { ...prevData, content: updatedContent };
          });
        }
      })
      .catch((error) => {
        console.error(error);
      });

    setCommentTexts((prev) => ({ ...prev, [doubtId]: "" }));
  };
  const handleUpvoteComment = (doubtId, commentId) => {
    upVote(commentId, user?.userId)
      .then((updatedComment) => {
        toast.info("Comment upvoted successfully!");
        // Re-fetch the data so all comment upvotes are up to date
        return getAllDoubt(currentPage, catId);
      })
      .then((res) => {
        setData(res); // Set the new data with updated upvotes
      })
      .catch((error) => {
        console.error(error);
        toast.error("Failed to upvote comment");
      });
  };

  return (
    <div className="pt-20 px-4 min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">
        <CategoryNav />

        <div className="flex-1 flex flex-col gap-8">
          {data.content.length === 0 ? (
            <div className="text-center text-xl text-gray-600 mt-10">
              No doubts yet.
            </div>
          ) : (
            data.content.map((doubt) => {
              const showFullAnswer = readMoreStates[doubt.doubtId] || false;
              const shortAnswer = doubt.aiAnswer
                ? doubt.aiAnswer.slice(0, 120) + "..."
                : "";

              return (
                <div
                  key={doubt.doubtId}
                  className="bg-white shadow-lg rounded-xl p-6 space-y-4"
                >
                  {/* Title */}

                  <div className="flex items-center gap-2 mb-2">
                    {doubt.user?.profilePic ? (
                      <img
                        src={doubt.user.profilePic}
                        alt={doubt.user.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold uppercase">
                        {doubt.user?.name ? doubt.user.name.charAt(0) : "?"}
                      </div>
                    )}
                    <span className="text-sm text-gray-500">
                      {doubt.user?.name || "Anonymous"}
                    </span>
                  </div>
                  <h2 className="text-1xl font-bold text-red-500">
                    {doubt.content || "No title"}
                  </h2>

                  {/* AI Answer */}
                  {doubt.aiAnswer && (
                    <div className="bg-blue-50 p-4 rounded border border-blue-200">
                      <h3 className="font-semibold text-green-700 mb-2">
                        AI Answer
                      </h3>
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {showFullAnswer ? doubt.aiAnswer : shortAnswer}
                      </ReactMarkdown>
                      {doubt.aiAnswer.length > 120 && (
                        <button
                          className="text-blue-600 hover:underline mt-2"
                          onClick={() => toggleReadMore(doubt.doubtId)}
                        >
                          {showFullAnswer ? "Show less" : "Read more"}
                        </button>
                      )}
                    </div>
                  )}

                  {/* Comments */}
                  <div className="pt-4 border-t mt-4">
                    <h4 className="text-lg font-semibold mb-2">Comments</h4>
                    {doubt.comments && doubt.comments.length > 0 ? (
                      doubt.comments.map((c) => {
                        const upvotes = c.upvotes || [];
                        return (
                          <div
                            key={c.commentId}
                            className="pb-3 border-b border-gray-200 mb-2 text-gray-800"
                          >
                            <div className="flex justify-between items-center">
                              <div className="flex flex-col">
                                <p className="font-medium">
                                  {c.user?.name || "Anonymous"}
                                </p>
                                <p>{c.content}</p>
                              </div>
                              <div className="flex items-center gap-4">
                                <span className="text-gray-600 text-sm">
                                  {upvotes.length} upvote
                                  {upvotes.length === 1 ? "" : "s"}
                                </span>
                                <button
                                  onClick={() =>
                                    handleUpvoteComment(
                                      doubt.doubtId,
                                      c.commentId
                                    )
                                  }
                                  className="text-blue-600 hover:text-blue-800 flex items-center"
                                >
                                  <FaArrowUp className="mr-1" /> Upvote
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-gray-500">No comments yet.</p>
                    )}
                  </div>

                  {/* Comment Input */}
                  {user ? (
                    <div className="pt-2 border-t mt-2">
                      <textarea
                        value={commentTexts[doubt.doubtId] || ""}
                        onChange={(e) =>
                          setCommentTexts((prev) => ({
                            ...prev,
                            [doubt.doubtId]: e.target.value,
                          }))
                        }
                        placeholder="Write your comment here..."
                        className="w-full border border-gray-300 rounded p-2 mt-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        rows={2}
                      />
                      <button
                        className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                        onClick={() => handleComment(doubt.doubtId)}
                      >
                        Submit Comment
                      </button>
                    </div>
                  ) : (
                    <p className="text-center text-gray-500 mt-2">
                      Log in to add a comment.
                    </p>
                  )}

                  {/* Meta */}
                  <div className="text-sm text-gray-500 flex justify-between mt-4">
                    <span>
                      Asked {dayjs.utc(doubt.createdAt).local().fromNow()}
                    </span>
                  </div>
                </div>
              );
            })
          )}

          {/* Pagination */}
          {data.totalPages > 1 && (
            <div className="mt-10 flex justify-center space-x-2">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 0}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded disabled:opacity-50"
              >
                Previous
              </button>
              {[...Array(data.totalPages).keys()].map((page) => (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`px-4 py-2 rounded ${
                    page === currentPage
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700 border border-gray-300"
                  }`}
                >
                  {page + 1}
                </button>
              ))}
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={data.lastPage}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Community;
