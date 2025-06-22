import React from "react";
import { Link } from "react-router-dom";
import WhyChooseUs from "./WhyChooseUs";
import Pricing from "./Pricing";

const Home = () => {
  return (
    <div className="pt-16 min-h-screen bg-gradient-to-r from-[#eaf0f9] via-[#d6e6f5] to-[#c4d7e8]">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl font-extrabold text-center mb-10 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">
          Unlock Your Potential
        </h1>
        <p className="text-lg text-gray-600 mb-10">
          Your AI-powered guide to mastering academic concepts and solving
          doubts for school and college students.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/ask-doubt"
            className="px-6 py-3 rounded-full border-2 border-blue-600 text-blue-600 font-semibold hover:bg-blue-50 transition"
          >
            SOLVE DOUBTS WITH AI 💬
          </Link>

          <Link
            to="/private/user-dash"
            className="relative px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-gray-900 text-white font-semibold shadow-md hover:opacity-90 transition flex flex-col items-center"
          >
            <span className="absolute -top-2 text-[10px] bg-yellow-400 text-black font-bold px-2 py-0.5 rounded-full shadow-sm">
              PRO
            </span>
            <span>PRACTICE QUIZ WITH AI ↗</span>
          </Link>
        </div>
      </div>
      <WhyChooseUs/>
      <Pricing/>
    </div>
  );
};

export default Home;
