import React from "react";
import { getUser } from "../../auth";
import QuizList from "./QuizList";
import Pricing from "../Pricing";

const QuizeMeDisplay = () => {
  const user = getUser();

  return user?.role === "pro" ? <QuizList /> : <Pricing />;
};

export default QuizeMeDisplay;
